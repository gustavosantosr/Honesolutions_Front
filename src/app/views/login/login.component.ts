import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Usuario } from '../../model/usuario';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})

export class LoginComponent {
  usuariolog: Usuario;
  constructor(private Auth: AuthService, private router: Router) { }
  @Input() usuario: Usuario;
  loginForm = new FormGroup({
    email: new FormControl(''),
    contrasena: new FormControl(''),
    recaptchaReactive: new FormControl('', Validators.required),
  });
  OnInit() {
  }

  loginUser() {
    this.usuario = this.loginForm.value;
    this.Auth.getUsersDetails(this.usuario)
    .subscribe(usuarios => this.usuariolog = usuarios,
      err => {
        alert('Los datos suministrados son incorrectos');
      },
      () => {
        if (this.usuariolog != null) {
          this.Auth.setLoggedIn(true, this.usuariolog);
          if (this.usuariolog.Rol.IDRol === 1) {
            this.router.navigate(['/dashboard']);
          } else if (this.usuariolog.Rol.IDRol === 2) {
            this.router.navigate(['/dashboard']);
          } else if (this.usuariolog.Rol.IDRol === 3) {
            this.router.navigate(['/dashboard']);
          }
        } else {
          window.alert('Los datos suministrados son incorrectos');
        }

      });
    }
}
