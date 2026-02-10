import { Component, inject, signal } from '@angular/core';
import { RegisterInterface } from '../../../models/register';
import { Authenication } from '../../../services/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";


@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  constructor(){
   
  }
auth=inject(Authenication);
router=inject(Router);
registerForm=signal<RegisterInterface>({
  userName:'',
  email:'',
  password:''
})

async sigUp(event:Event)
{
  event.preventDefault();
  console.log(this.registerForm());
 const user=await this.auth.register(this.registerForm().email,this.registerForm().password);
 console.log(user.user.uid);
 
this.setUserData(user.user.uid);
}

async setUserData(uid:string)
{
try
{
  console.log(uid);
await this.auth.storeUserAfterRegister(this.registerForm(),uid);
this.router.navigate(['/card']);
}
catch(err)
{
console.log(err);

}
}

}