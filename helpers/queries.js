module.exports.user = {
    Buscar: 'SELECT username FROM users WHERE username = $1',
    AgregarUsuario: 'INSERT INTO users (name, last_name, username) VALUES ($1, $2, $3) RETURNING id_user',
    GuardarNumero: 'UPDATE users SET number=$1  WHERE id_user=$2',
    VerificarNumero: 'UPDATE users SET authenticate=true  WHERE id_user=$1',
    VerificarCodigo: 'SELECT *FROM code WHERE id_user=$1 AND code=$2',
    GuardarCodigo:"INSERT INTO code (code, id_user) VALUES ($1, $2)",
    ChequearNumero:"SELECT *FROM users WHERE number = $1 AND authenticate=true",
    ChequearCodigo: "SELECT *FROM code WHERE id_user=$1",
    BorrarCodigo:"DELETE FROM code WHERE id_user=$1",
    VerificarActivo:"SELECT *FROM users WHERE id_user=$1 AND authenticate=false"

}

module.exports.profile = {
    ActualizarPerfil:"UPDATE users SET name=$1, last_name=$2, username=$3 WHERE id_user=$4 ",
    BuscarUsuario:'SELECT username FROM users WHERE username =$1 AND id_user!=$2',
    BorrarUsuario: 'DELETE FROM users WHERE id_user=$1',
    LeerUsuario: 'SELECT *FROM users WHERE id_user=$1'
}
