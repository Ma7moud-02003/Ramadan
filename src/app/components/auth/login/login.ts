import { Component, inject, signal } from '@angular/core';
import { Authenication } from '../../../services/auth';
import { RegisterInterface } from '../../../models/register';
import { LoginInterface } from '../../../models/login';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
auth=inject(Authenication);
router=inject(Router);
user=signal<LoginInterface>({
  email:'',
  password:''
})

login(event:Event)
{
  console.log(this.user());
  event.preventDefault();
this.auth.login(this.user().email,this.user().password).then((res)=>{
this.router.navigate(['/card']);
console.log(res);
}).catch((err)=>{
  console.log(err);
alert('invalid-credential')
  
})

}
}
