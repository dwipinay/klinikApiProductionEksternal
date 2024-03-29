const pool = require('../configs/pool')
const Database = require('./Database')

class Klinik {
    getAll(req, callback) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100
        
        const startIndex =  (page - 1) * limit
        const endIndex = limit

        const sqlSelect = 'SELECT dbfaskes.trans_final.kode_faskes as id, ' +
            'dbfaskes.trans_final.kode_faskes_baru as idBaru, ' +
            'dbfaskes.data_klinik.nama_klinik as nama,' +
            'dbfaskes.data_klinik.pemilik as pemilik,' +
            'dbfaskes.data_klinik.nama_pemilik as namaPemilik,' +
            'dbfaskes.data_klinik.nama_penanggung_jawab_klinik as namaPenanggungJawabKlinik,' +
            'dbfaskes.data_klinik.jenis_modal_usaha as jenisModalUsaha, ' +
            'dbfaskes.data_klinik.jenis_klinik as jenisKlinik ,' +
            'dbfaskes.data_klinik.jenis_perawatan as jenisPerawatan,' +
            'dbfaskes.data_klinik.alamat_faskes as alamat,' +
            'dbfaskes.data_klinik.no_telp as noTelp,' +
            'dbfaskes.data_klinik.email as email,' +
            'dbfaskes.data_klinik.id_prov as provinsiId, ' +
            'dbfaskes.propinsi.nama_prop as provinsiNama, ' +
            'dbfaskes.data_klinik.id_kota as kabKotaId, ' +
            'dbfaskes.kota.nama_kota as kabKotaNama, ' +
            'dbfaskes.data_klinik.id_camat as kecamatanId, ' +
            'dbfaskes.data_klinik.nama_puskesmas as puskesmasPembina, ' +
            'dbfaskes.data_klinik.persalinan as persalinan, ' +
            'dbfaskes.data_klinik.latitude,' +
            'dbfaskes.data_klinik.longitude, ' +
            'dbfaskes.data_klinik.created_at, ' +
            'dbfaskes.data_klinik.modified_at '

        const sqlFrom = 'FROM dbfaskes.data_klinik ' +
            'INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_klinik.id_faskes ' +
            'INNER JOIN dbfaskes.propinsi ON dbfaskes.propinsi.id_prop = dbfaskes.data_klinik.id_prov ' +
            'INNER JOIN dbfaskes.kota ON dbfaskes.kota.id_kota = dbfaskes.data_klinik.id_kota '

        const sqlOrder = ' ORDER BY dbfaskes.data_klinik.id_prov,' +
            'dbfaskes.data_klinik.id_kota,' +
            'dbfaskes.data_klinik.id_camat ' 

        const sqlLimit = 'LIMIT ? '
            
        const sqlOffSet = 'OFFSET ?'

        const sqlWhere = 'WHERE dbfaskes.trans_final.kode_faskes IS NOT NULL AND '

        const filter = []
        const sqlFilterValue = []

        const provinsiId = req.query.provinsiId || null
        const kabKotaId = req.query.kabkotaId || null
        const jenis = req.query.jenis|| null
        const nama = req.query.nama || null

        if (provinsiId != null) {
            filter.push("dbfaskes.data_klinik.id_prov = ?")
            sqlFilterValue.push(provinsiId)
        }

        if (kabKotaId != null) {
            filter.push("dbfaskes.data_klinik.id_kota = ?")
            sqlFilterValue.push(kabKotaId)
        }

        if (nama != null) {
            filter.push("dbfaskes.data_klinik.nama_klinik like ?")
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
        const sql = 'SELECT dbfaskes.trans_final.kode_faskes as faskesId,' +
            'dbfaskes.trans_final.kode_faskes_baru as idBaru, ' +
            'dbfaskes.data_klinik.nama_klinik as nama,' +
            'dbfaskes.data_klinik.pemilik as pemilik,' +
            'dbfaskes.data_klinik.nama_pemilik as namaPemilik,' +
            'dbfaskes.data_klinik.nama_penanggung_jawab_klinik as namaPenanggungJawabKlinik,' +
            'dbfaskes.data_klinik.jenis_modal_usaha as jenisModalUsaha, ' +
            'dbfaskes.data_klinik.jenis_klinik as jenisKlinik ,' +
            'dbfaskes.data_klinik.jenis_perawatan as jenisPerawatan,' +
            'dbfaskes.data_klinik.alamat_faskes as alamat,' +
            'dbfaskes.data_klinik.no_telp as noTelp,' +
            'dbfaskes.data_klinik.email as email,' +
            'dbfaskes.data_klinik.id_prov as provinsiId, ' +
            'dbfaskes.propinsi.nama_prop as provinsiNama, ' +
            'dbfaskes.data_klinik.id_kota as kabKotaId, ' +
            'dbfaskes.kota.nama_kota as kabKotaNama, ' +
            'dbfaskes.data_klinik.id_camat as kecamatanId, ' +
            'dbfaskes.data_klinik.nama_puskesmas as puskesmasPembina, ' +
            'dbfaskes.data_klinik.persalinan as persalinan, ' +
            'dbfaskes.data_klinik.latitude,' +
            'dbfaskes.data_klinik.longitude, ' +
            'dbfaskes.data_klinik.created_at, ' +
            'dbfaskes.data_klinik.modified_at ' +
        'FROM ' +
            'dbfaskes.data_klinik ' +
            'INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_klinik.id_faskes ' +
            'INNER JOIN dbfaskes.propinsi ON dbfaskes.propinsi.id_prop = dbfaskes.data_klinik.id_prov ' +
            'INNER JOIN dbfaskes.kota ON dbfaskes.kota.id_kota = dbfaskes.data_klinik.id_kota ' +
        'WHERE dbfaskes.trans_final.kode_faskes_baru = ?'

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


module.exports = Klinik