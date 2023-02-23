const pool = require('../configs/poolRSOnline')
const Database = require('./Database')

class RumahSakit {
    getAll(req, callback) {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) > 100 ? 100 : parseInt(req.query.limit) || 100
        
        const startIndex =  (page - 1) * limit
        const endIndex = limit

        const sqlSelect = 'SELECT db_fasyankes.`data`.Propinsi as kode, ' +
            'db_fasyankes.`data`.RUMAH_SAKIT AS nama, ' +
            'db_fasyankes.`data`.ALAMAT AS alamat, ' +
            'reference.provinsi.nama as provinsiNama, ' +
            'reference.kab_kota.nama as kabKotaNama, ' +
            'db_fasyankes.m_jenis.alias AS jenis, ' +
            'db_fasyankes.m_kelas.kelas AS kelas, ' +
            'db_fasyankes.m_kepemilikan.kepemilikan AS kepemilikan, ' +
            'db_fasyankes.t_dok_tariflayanan_rs.url as urlTarif '

        const sqlFrom = 'FROM db_fasyankes.`data` INNER JOIN reference.provinsi ' +
        'ON reference.provinsi.id = db_fasyankes.`data`.provinsi_id ' +
        'INNER JOIN reference.kab_kota ' +
        'ON reference.kab_kota.id = db_fasyankes.`data`.kab_kota_id ' +
        'INNER JOIN db_fasyankes.m_jenis ' +
        'ON db_fasyankes.m_jenis.id_jenis = db_fasyankes.`data`.JENIS ' +
        'INNER JOIN db_fasyankes.m_kelas ' +
        'ON db_fasyankes.m_kelas.id_kelas = db_fasyankes.`data`.KLS_RS ' +
        'INNER JOIN db_fasyankes.m_kepemilikan ' +
        'ON db_fasyankes.m_kepemilikan.id_kepemilikan = db_fasyankes.`data`.PENYELENGGARA ' +
        'INNER JOIN db_fasyankes.m_blu ON db_fasyankes.m_blu.id_blu = db_fasyankes.`data`.blu  ' +
        'LEFT OUTER JOIN db_fasyankes.t_dok_tariflayanan_rs on db_fasyankes.t_dok_tariflayanan_rs.koders = db_fasyankes.`data`.Propinsi '

        const sqlOrder = ' ORDER BY db_fasyankes.`data`.RUMAH_SAKIT ' 

        const sqlLimit = 'LIMIT ? '
            
        const sqlOffSet = 'OFFSET ?'

        const sqlWhere = 'WHERE db_fasyankes.`data`.aktive = 1 AND '

        const filter = []
        const sqlFilterValue = []

        const provinsiId = req.query.provinsiId || null
        const kabKotaId = req.query.kabKotaId || null

        if (provinsiId != null) {
            filter.push("db_fasyankes.`data`.provinsi_id = ?")
            sqlFilterValue.push(provinsiId)
        }

        if (kabKotaId != null) {
            filter.push("db_fasyankes.`data`.kab_kota_id = ?")
            sqlFilterValue.push(kabKotaId)
        }

        sqlFilterValue.push(endIndex)
        sqlFilterValue.push(startIndex)

        let sqlFilter = ''
        if (filter.length == 0) {
            sqlFilter = 'WHERE db_fasyankes.`data`.aktive = 1'
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
                const sqlSelectCount = 'SELECT count(db_fasyankes.`data`.Propinsi) as total_row_count '
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

    // show(id, req, callback) {
    //     const database = new Database(pool)
    //     const sql = 'SELECT dbfaskes.trans_final.kode_faskes as faskesId,' +
    //         'dbfaskes.data_klinik.nama_klinik as nama,' +
    //         'dbfaskes.data_klinik.jenis_klinik as jenisKlinik,' +
    //         'dbfaskes.data_klinik.jenis_perawatan as jenisPerawatan,' +
    //         'dbfaskes.data_klinik.alamat_faskes as alamat,' +
    //         'dbfaskes.propinsi.nama_prop as propinsiNama,' +
    //         'dbfaskes.kota.nama_kota as kotaNama,' +
    //         'dbfaskes.data_klinik.no_telp as noTelp,' +
    //         'dbfaskes.data_klinik.latitude,' +
    //         'dbfaskes.data_klinik.longitude ' +
    //     'FROM ' +
    //         'dbfaskes.data_klinik ' +
    //         'INNER JOIN dbfaskes.trans_final ON dbfaskes.trans_final.id_faskes = dbfaskes.data_klinik.id_faskes ' +
    //         'INNER JOIN dbfaskes.propinsi ON dbfaskes.propinsi.id_prop = dbfaskes.data_klinik.id_prov ' +
    //         'INNER JOIN dbfaskes.kota ON dbfaskes.kota.id_kota = dbfaskes.data_klinik.id_kota ' +
    //     'WHERE dbfaskes.trans_final.kode_faskes = ?'

    //     const sqlFilterValue = [id]
    //     database.query(sql, sqlFilterValue)
    //     .then(
    //         (res) => {
    //             callback(null, res)
    //         },(error) => {
    //             throw error
    //         }
    //     )
    //     .catch((error) => {
    //             callback(error, null)
    //         }
    //     )
    // }
}


module.exports = RumahSakit