const pool = require('../configs/pool')
const Database = require('./Database')

class PraktekMandiri {
    getAll(req, callback) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100
        
        const startIndex =  (page - 1) * limit
        const endIndex = limit

        const sqlSelect = 'SELECT ' +
            'dbfaskes.trans_final.kode_faskes as id, ' +
            'dbfaskes.trans_final.kode_faskes_baru as idBaru, ' +
            'dbfaskes.data_pm.nama_pm as nama, ' +
            'dbfaskes.data_pm.no_sip as noSIP, ' +
            'dbfaskes.data_pm.tgl_berakhir_sip as tanggalBerakhirSIP, ' +
            'dbfaskes.data_pm.kepemilikan_tempat as kepemilikanTempat, ' +
            'dbfaskes.data_pm.no_str as noSTR, ' +
            'dbfaskes.data_pm.tgl_berakhir_str as tanggalBerakhirSTR, ' +
            'dbfaskes.data_pm.alamat_faskes as alamat, ' +
            'dbfaskes.data_pm.no_telp as noTelp, ' +
            'dbfaskes.data_pm.email as email, ' +
            'dbfaskes.data_pm.id_prov_pm as provinsiId, ' +
            'dbfaskes.propinsi.nama_prop as provinsiNama, ' +
            'dbfaskes.data_pm.id_kota_pm as kabKotaId, ' +
            'dbfaskes.kota.nama_kota as kabKotaNama, ' +
            'dbfaskes.data_pm.id_camat_pm as kecamatanId, ' +
            'dbfaskes.data_pm.puskesmas_pembina as puskesmasPembina, ' +
            'dbfaskes.data_pm.kerja_sama_bpjs_kesehatan as kerjaSamaBPJSKesehatan, ' +
            'dbfaskes.data_pm.berjejaring_fktp as berjejaringFKTP, ' +
            'dbfaskes.data_pm.latitude, ' +
            'dbfaskes.data_pm.longitude '

        const sqlFrom = 'FROM ' +
            'dbfaskes.data_pm INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_pm.id_faskes ' +
            'INNER JOIN dbfaskes.propinsi ON dbfaskes.propinsi.id_prop = dbfaskes.data_pm.id_prov_pm ' +
            'INNER JOIN dbfaskes.kota ON dbfaskes.kota.id_kota = dbfaskes.data_pm.id_kota_pm '

        const sqlOrder = ' ORDER BY dbfaskes.data_pm.id_prov_pm,' +
            'dbfaskes.data_pm.id_kota_pm '

        const sqlLimit = 'LIMIT ? '
        
        const sqlOffSet = 'OFFSET ?'
        
        const sqlWhere = 'WHERE dbfaskes.trans_final.kode_faskes IS NOT NULL AND '

        const filter = []
        const sqlFilterValue = []

        const provinsiId = req.query.provinsiId || null
        const kabKotaId = req.query.kabKotaId || null
        const nama = req.query.nama || null

        if (provinsiId != null) {
            filter.push("dbfaskes.data_pm.id_prov_pm = ?")
            sqlFilterValue.push(provinsiId)
        }

        if (kabKotaId != null) {
            filter.push("dbfaskes.data_pm.id_kota_pm = ?")
            sqlFilterValue.push(kabKotaId)
        }

        if (nama != null) {
            filter.push("dbfaskes.data_pm.nama_pm like ?")
            sqlFilterValue.push('%'.concat(nama).concat('%'))
        }

        sqlFilterValue.push(endIndex)
        sqlFilterValue.push(startIndex)

        let sqlFilter = ''
        if (filter.length == 0) {
            sqlFilter = 'WHERE dbfaskes.trans_final.kode_faskes IS NOT NULL'
        } else {
            filter.forEach((value, index) => {
                if (index == 0) {
                    sqlFilter = sqlWhere.concat(value)
                } else if (index > 0) {
                    sqlFilter = sqlFilter.concat(' and ').concat(value)
                }
            })
        }

        const sql = sqlSelect.concat(sqlFrom).concat(sqlFilter).concat(sqlOrder).concat(sqlLimit).concat(sqlOffSet)
        
        const database = new Database(pool)
        database.query(sql, sqlFilterValue)
        .then(
            (res) => {
                const sqlSelectCount = 'SELECT count(dbfaskes.trans_final.kode_faskes) as total_row_count '
                const sqlCount = sqlSelectCount.concat(sqlFrom).concat(sqlFilter)
                database.query(sqlCount, sqlFilterValue)
                .then(
                    (resCount) => {
                        const data = {
                            totalRowCount: resCount[0].total_row_count,
                            page: page,
                            limit: limit,
                            data: res
                        }
                        callback(null, data)
                    },(error) => {
                        throw error
                    }
                )
                .catch((error) => {
                    
                })
            },(error) => {
                throw error
            }
        )
        .catch((error) => {
                callback(error, null)
            }
        )
    }

    show(id, req, callback) {
        const database = new Database(pool)
        const sql = 'SELECT ' +
            'dbfaskes.trans_final.kode_faskes as id, ' +
            'dbfaskes.data_pm.nama_pm as nama, ' +
            'dbfaskes.data_pm.alamat_faskes as alamat, ' +
            'dbfaskes.data_pm.no_telp as noTelp, ' +
            'dbfaskes.propinsi.nama_prop as provinsi,' +
            'dbfaskes.kota.nama_kota as kabKota,' +
            'dbfaskes.data_pm.latitude,' +
            'dbfaskes.data_pm.longitude ' +
        'FROM ' +
            'dbfaskes.data_pm INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_pm.id_faskes ' +
            'INNER JOIN dbfaskes.propinsi ON dbfaskes.propinsi.id_prop = dbfaskes.data_pm.id_prov_pm ' +
            'INNER JOIN dbfaskes.kota ON dbfaskes.kota.id_kota = dbfaskes.data_pm.id_kota_pm ' +
            'INNER JOIN dbfaskes.kategori_pm ON dbfaskes.kategori_pm.id =  dbfaskes.data_pm.id_kategori ' +
        'WHERE dbfaskes.trans_final.kode_faskes = ?'

        const sqlFilterValue = [id]
        database.query(sql, sqlFilterValue)
        .then(
            (res) => {
                callback(null, res)
            },(error) => {
                throw error
            }
        )
        .catch((error) => {
                callback(error, null)
            }
        )
    }
}

module.exports = PraktekMandiri