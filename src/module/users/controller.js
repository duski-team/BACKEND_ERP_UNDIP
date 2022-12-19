const { sq } = require("../../config/connection");
const { v4: uuid_v4 } = require("uuid");
const users = require("./model");
const company = require("../company_usaha/model")
const coa5 = require("../coa5/model")
const coa6 = require("../coa6/model")
const { QueryTypes, Op } = require('sequelize');
const s = { type: QueryTypes.SELECT };
const bcrypt = require('../../helper/bcrypt');
const jwt = require('../../helper/jwt');
const { token } = require('morgan');

async function createSuperUser() {
    try {
        let encryptedPassword = bcrypt.hashPassword(process.env.ADMIN);
        await company.findOrCreate({
            where: { id: "UNDIP" },
            defaults: {
                id: "UNDIP",
                nama_usaha: "MASTER",
                nama_pengelola: "UNDIP",
                code: "UNDIP"
            }
        })
        await users.findOrCreate({
            where: { username: "erp_admin" },
            defaults: {
                id: "superadmin",
                username: "erp_admin",
                email: "admin@gmail.com",
                password: encryptedPassword,
                company_id: "UNDIP"
            }
        })
    } catch (err) {
        console.log(err);
    }
}

createSuperUser()

class Controller {

    static async register(req, res) {
        const { email, username, firstname, lastname, phone_no, password, register_token, resetpassword_token, variant, priority, jenis_user_id, nama_usaha, location, code, nik, alamat_users, waktu_masuk, waktu_keluar, tanggal_masuk, tanggal_keluar, jenis_penugasan, pendidikan_id, jenis_kerja_id, kompetensi_id } = req.body

        const t = await sq.transaction();

        try {
            let cekCompany = await company.findAll({ where: { [Op.or]: [{ nama_usaha }, { code }] } });
            let cekUser = await users.findAll({ where: { [Op.or]: [{ email }, { username }] } });

            if (cekCompany.length > 0 || cekUser.length > 0) {
                res.status(201).json({ status: 204, message: "data sudah ada" });
            } else {
                let profil_image = "";

                if (req.files) {
                    if (req.files.file1) {
                        profil_image = req.files.file1[0].filename;
                    }
                }
                let encryptedPassword = bcrypt.hashPassword(password);
                let perusahan_id = await company.create({ id: uuid_v4(), nama_usaha, location, code }, { transaction: t })
                let data = await users.create({ id: uuid_v4(), email, username, firstname, lastname, phone_no, password: encryptedPassword, register_token, resetpassword_token, variant, priority, profil_image, jenis_user_id, company_id: perusahan_id.id, nik, alamat_users, waktu_masuk, waktu_keluar, tanggal_masuk, tanggal_keluar, jenis_penugasan, pendidikan_id, jenis_kerja_id, kompetensi_id }, { transaction: t })
                await t.commit();

                res.status(200).json({ status: 200, message: "sukses", data });
            }
        } catch (err) {
            await t.rollback();
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async registerUser(req, res) {
        const { email, username, firstname, lastname, phone_no, password, register_token, resetpassword_token, variant, priority,nik, alamat_users, waktu_masuk, waktu_keluar, tanggal_masuk, tanggal_keluar, jenis_penugasan,jenis_user_id, company_id, pendidikan_id, jenis_kerja_id, kompetensi_id,status_users } = req.body

        try {
            let cekUser = await users.findAll({ where: { [Op.or]: [{ email }, { username }] } });

            if (cekUser.length > 0) {
                res.status(201).json({ status: 204, message: "data sudah ada" });
            } else {
                let profil_image = "";

                if (req.files) {
                    if (req.files.file1) {
                        profil_image = req.files.file1[0].filename;
                    }
                }
                let encryptedPassword = bcrypt.hashPassword(password);
                
                let data = await users.create({ id: uuid_v4(), email, username, firstname, lastname, phone_no, password:encryptedPassword, register_token, resetpassword_token, variant, priority,nik, alamat_users, waktu_masuk, waktu_keluar, tanggal_masuk, tanggal_keluar, jenis_penugasan,jenis_user_id, company_id, pendidikan_id, jenis_kerja_id, kompetensi_id,profil_image,status_users })

                res.status(200).json({ status: 200, message: "sukses", data });
            }
        } catch (err) {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static update(req, res) {
        const { id, email, username, firstname, lastname, phone_no, password, register_token, resetpassword_token, variant, priority, jenis_user_id, company_id, nik, alamat_users, waktu_masuk, waktu_keluar, tanggal_masuk, tanggal_keluar, jenis_penugasan, pendidikan_id, jenis_kerja_id, kompetensi_id } = req.body

        if (req.files) {
            if (req.files.file1) {
                let profil_image = req.files.file1[0].filename;
                users.update({ profil_image }, { where: { id } })
            }
        }

        users.update({ email, username, firstname, lastname, phone_no, password, register_token, resetpassword_token, variant, priority, jenis_user_id, company_id, nik, alamat_users, waktu_masuk, waktu_keluar, tanggal_masuk, tanggal_keluar, jenis_penugasan, pendidikan_id, jenis_kerja_id, kompetensi_id }, { where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static delete(req, res) {
        const { id } = req.body

        users.destroy({ where: { id } }).then(data => {
            res.status(200).json({ status: 200, message: "sukses" });
        }).catch(err => {
            console.log(req.body);
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        })
    }

    static async list(req, res) {
        try {
            let data = await sq.query(`SELECT u.id as user_id,u.*,cu.*,p.nama_pendidikan, jk.nama_jenis_kerja,k.nama_kompetensi,ju.nama_jenis_user,
            ju.kode_role FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id left join pendidikan p on p.id = u.pendidikan_id left join jenis_kerja jk on jk.id = u.jenis_kerja_id left join kompetensi k on k.id = u.kompetensi_id where u."deletedAt" isnull order by u."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listUserByCompanyId(req, res) {
        let { company_id } = req.body
        try {
            if(!company_id){
                company_id = req.dataUser.token
            }

            let data = await sq.query(`SELECT u.id as user_id,u.*,cu.*,p.nama_pendidikan, jk.nama_jenis_kerja,k.nama_kompetensi,ju.nama_jenis_user,
            ju.kode_role, u.email as email_user, u.phone_no as phone_no_user, cu.email as email_company, cu.phone_no as phone_no_company FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id left join pendidikan p on p.id = u.pendidikan_id left join jenis_kerja jk on jk.id = u.jenis_kerja_id left join kompetensi k on k.id = u.kompetensi_id where u."deletedAt" isnull and u.company_id = '${company_id}' order by u."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listUserByJenisUserId(req, res) {
        const { jenis_user_id } = req.body
        try {
            let data = await sq.query(`SELECT u.id as user_id,u.*,cu.*,p.nama_pendidikan, jk.nama_jenis_kerja,k.nama_kompetensi,ju.nama_jenis_user,
            ju.kode_role FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id left join pendidikan p on p.id = u.pendidikan_id left join jenis_kerja jk on jk.id = u.jenis_kerja_id left join kompetensi k on k.id = u.kompetensi_id where u."deletedAt" isnull and u.jenis_user_id = '${jenis_user_id}' order by u."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async detailsById(req, res) {
        const { id } = req.params

        try {
            let data = await sq.query(`SELECT u.id as user_id,u.*,cu.*,p.nama_pendidikan, jk.nama_jenis_kerja,k.nama_kompetensi,ju.nama_jenis_user,
            ju.kode_role FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id left join pendidikan p on p.id = u.pendidikan_id left join jenis_kerja jk on jk.id = u.jenis_kerja_id left join kompetensi k on k.id = u.kompetensi_id where u."deletedAt" isnull and u.id = '${id}'`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async login(req, res) {
        const { username, password, code } = req.body

        try {
            let perusahan_id = await company.findAll({ where: { code } });
            let cekUser = await sq.query(`select u.*,ju.nama_jenis_user,ju.kode_role from users u join jenis_user ju on ju.id = u.jenis_user_id where u."deletedAt" isnull and u.username = '${username}' and u.company_id = '${perusahan_id[0].id}'`,s);

            if (perusahan_id.length == 0) {
                res.status(201).json({ status: 204, message: "Perusahaan Code Tidak Terdaftar" });
            } else {
                if (cekUser.length == 0) {
                    res.status(201).json({ status: 204, message: "User Tidak Terdaftar" });
                } else {
                    if(cekUser[0].status_users != 2){
                        res.status(201).json({ status: 204, message: "Anda belum terverifikasi" });
                    }else{
                        let dataToken = {
                            id: cekUser[0].id,
                            email: cekUser[0].email,
                            username: cekUser[0].username,
                            jenis_user_id: cekUser[0].jenis_user_id,
                            company_id: cekUser[0].company_id,
                            password: cekUser[0].password,
                            kode_role: cekUser[0].kode_role,
                        }
                        let hasil = bcrypt.compare(password, cekUser[0].password);
                        if (hasil) {
                            res.status(200).json({ status: 200, message: "sukses", token: jwt.generateToken(dataToken), data: dataToken });
                        } else {
                            res.status(201).json({ status: 204, message: "Password Salah" });
                        }
                    }
                }
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async cekEmailUsername(req, res) {
        const { username, email } = req.body
        try {
            let isi = ''
            if (username) {
                isi += ` and u.username ilike '%${username}%' `
            }
            if (email) {
                isi += ` and u.email ilike '%${email}%' `
            }
            let data = await sq.query(`select * from users u where u."deletedAt" isnull ${isi}`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async listUserAdminCompany(req, res) {
        const { status_users } = req.body
        try {
            let isi = ''
            if (status_users) {
                isi += `and u.status_users =${status_users}`
            }

            let data = await sq.query(`SELECT u.id as user_id,u.*,cu.*,p.nama_pendidikan, jk.nama_jenis_kerja,k.nama_kompetensi,ju.nama_jenis_user,
            ju.kode_role FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id left join pendidikan p on p.id = u.pendidikan_id left join jenis_kerja jk on jk.id = u.jenis_kerja_id left join kompetensi k on k.id = u.kompetensi_id where u."deletedAt" isnull and ju.nama_jenis_user ilike 'admin_company' ${isi} order by u."createdAt" desc`, s);

            res.status(200).json({ status: 200, message: "sukses", data });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async aceptedUser(req, res) {
        const { id } = req.body

        try {
            const t = await sq.transaction()

            let cekUser = await sq.query(`select * from users u where u."deletedAt" isnull and u.id = '${id}'`, s)
            // console.log(cekUser[0].status_users);
            if (cekUser[0].status_users == 1) {
                let cekCoa5 = await sq.query(`select * from coa5 c where c."deletedAt" isnull and c.company_id = 'UNDIP' order by c.kode_coa5`, s)
                let cekCoa6 = await sq.query(`select * from coa6 c where c.coa5_id in (select c2.id from coa5 c2 where c2.company_id = 'UNDIP' order by c2.kode_coa5) `, s)
                for (let i = 0; i < cekCoa5.length; i++) {
                    let idCoa5 = uuid_v4()
                    for (let j = 0; j < cekCoa6.length; j++) {
                        if (cekCoa6[j].coa5_id == cekCoa5[i].id) {
                            cekCoa6[j].id = uuid_v4()
                            cekCoa6[j].coa5_id = idCoa5
                        }
                    }
                    cekCoa5[i].id = idCoa5
                    cekCoa5[i].company_id = cekUser[0].company_id

                }
                // console.log(cekCoa5);
                // console.log(cekCoa6);
                await users.update({ status_users: 2 }, { where: { id }, transaction: t })
                await coa5.bulkCreate(cekCoa5, { transaction: t })
                await coa6.bulkCreate(cekCoa6, { transaction: t })
                await t.commit()
                res.status(200).json({ status: 200, message: "sukses" });
            } else {
                res.status(200).json({ status: 200, message: "status user bukan 1" });
            }
        } catch (err) {
            await t.rollback()
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err });
        }
    }

    static async registerPelanggan(req, res) {
        const { firstname, lastname, phone_no } = req.body

        try {
            let data = await users.findAll({ where: { phone_no } })
            if (data.length) {
                res.status(200).json({ status: 200, message: "sukses", data })
            } else {
                let jenisUser = await sq.query(`select ju.id as "jenis_user_id", upper(ju.nama_jenis_user) as "jenis_user" from jenis_user ju where ju."deletedAt" isnull and upper(ju.nama_jenis_user) = 'PELANGGAN'`, s)
                let pelanggan = await users.create({ id: uuid_v4(), username: phone_no, firstname, lastname, phone_no, jenis_user_id: jenisUser[0].jenis_user_id })
                res.status(200).json({ status: 200, message: "sukses", data: [pelanggan] })
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async cekUserByNomorHp(req, res) {
        const { phone_no } = req.body
        try {
            let data = await users.findAll({ where: { phone_no } })
            res.status(200).json({ status: 200, message: "sukses", data })
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }

    static async listUserBySatatus (req,res) {
        const {status_user} = req.body
        try {

            let data = await sq.query(`SELECT u.id as user_id,u.*,cu.*,p.nama_pendidikan,jk.nama_jenis_kerja,k.nama_kompetensi,ju.nama_jenis_user,
            ju.kode_role FROM users u join jenis_user ju on ju.id = u.jenis_user_id join company_usaha cu on cu.id = u.company_id left join pendidikan p on p.id = u.pendidikan_id left join jenis_kerja jk on jk.id = u.jenis_kerja_id left join kompetensi k on k.id = u.kompetensi_id where u."deletedAt" isnull and u.status_users = ${status_user} order by u."createdAt" desc`,s);

            res.status(200).json({ status: 200, message: "sukses", data })
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: 500, message: "gagal", data: err })
        }
    }
}
module.exports = Controller;