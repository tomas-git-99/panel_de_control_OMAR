const PERMISOS = require("../index")



test("queremos que nos mande admin", () => {

    const res = PERMISOS["ADMIN"]

    expect(res).toBe("ADMIN")
})