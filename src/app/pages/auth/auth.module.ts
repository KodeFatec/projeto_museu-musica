import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthPageComponent } from './auth-page.component';
import { AuthFieldComponent } from './components/auth-field/auth-field.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';

/** Login e cadastro, carregados sob demanda (/login e /cadastro usam a mesma casca). */
@NgModule({
  declarations: [AuthPageComponent, AuthFieldComponent, LoginFormComponent, RegisterFormComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild([{ path: '', component: AuthPageComponent }])],
})
export class AuthModule {}
