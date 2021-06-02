import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment';
import { Usuario } from './../model/usuario';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private LoggedInStatus = false;
  private usuario: Usuario;

  constructor(private http: HttpClient) { }
  url = environment.base_Url1;

  setLoggedIn(value: boolean, usuario: Usuario) {
    this.LoggedInStatus = value;
    this.usuario = usuario;
  }
  get getId() {
    return this.usuario.IDUsuario;
  }
  get getType() {
    return this.usuario.Rol.IDRol;
  }
  get isLoggedIn() {
    return this.LoggedInStatus;
  }
  get CurrentUser() {
    return this.usuario;
  }


  getUsersDetails(usuario: Usuario) {
    return this.http.post<Usuario>(this.url + '/getauth', JSON.stringify(usuario));
  }
  registerUserService(username, password, nickname) {

    // tslint:disable-next-line:max-line-length
    return this.http.post<Usuario>(this.url + 'UsuariosQ.php', 'comando=insert&usuario=' + username + '&contrasena=' + password + '&nickname=' + nickname);
  }

}
