import * as React from 'react'
import {Student} from './student'
import {ajax} from 'jquery'
import {Link} from 'react-router'

 export class StudentActivity extends Student{
   delete(){
     ajax({
 			method:"DELETE",
 	        url: `${window._BASE}/v1/activities/${this.props.activity}/student/${this.props.student._id}?PublicKeyId=${this.props.session.publicKeyId}&PrivateKeyId=${this.props.session.privateKeyId}`,
 	        dataType: "json",
 	        data:null,
 	        crossDomain:true,
 	        success:(data: People.student)=>{
 	        	this.props.delete(data);
 	        }
 		});
   }
 }
