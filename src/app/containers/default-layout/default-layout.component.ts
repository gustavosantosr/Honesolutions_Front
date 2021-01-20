import { Component, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { navItems1 } from '../../_nav1';
import { navItems2 } from '../../_nav2';
import { navItems3 } from '../../_nav3';
import { navItems4 } from '../../_nav4';
import { navItems5 } from '../../_nav5';
import { navItems10 } from '../../_nav10';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy {
  public navItems = navItems;
  id_usuario;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  constructor(private Auth: AuthService, @Inject(DOCUMENT) _document?: any) {

    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });
  }
  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    const id_usuario = this.Auth.getId;
    const tipo_usuario = this.Auth.getType;
    // window.alert('El marcador fue registrado exitosamente' + tipo_usuario);
    if (tipo_usuario == 2) {
      this.navItems = navItems2;
    } else{
      this.navItems = navItems;
    }
  }
  ngOnDestroy(): void {
    this.changes.disconnect();
  }
}
