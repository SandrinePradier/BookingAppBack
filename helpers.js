import express from 'express';
import jwt from 'jsonwebtoken';

import Appointment from './modules/professional/main/modelapt.js';
import Slot from './modules/professional/main/modelslot.js';


//Variable for responses
let response = {
  ok:{
    status: 'success',
    tokenaccess:'',
    message: '',
    content: ''
  },
  error:{
    status: 'error',
    tokenaccess: '',
    message: ''
  }
}

function sendReply(a,b, res){
    res.status(200).send({success:true, message:'Votre RDV a bien été confirmé'})
}

// Here middleware function to secure all below routes
function checkToken (req, res, next ){

        let token = req.headers['token'];
        let headers = req.headers;
        console.log('header: ', headers);

        if(token){
        	console.log('token: ', token);
	    //THIS is for information: only decode the token and see header token detail and payload
	        let decodedtoken = jwt.decode(token, {complete: true});
	        console.log('decodedheader', decodedtoken.header);
	        console.log('decodedpayload', decodedtoken.payload);
        //Decode the token and check if valid
          	jwt.verify(token,'mysecret',(err, decod)=>{
          	if(err) return err;
          	if(!decod){
          		response.error.tokenaccess = 'Token required';
          		response.error.message = 'Wrong Token, access denied';
          		res.status(403).send(response.error);
          	}
          	else{
	            req.decoded = decod;
	            //here we put decoded token in req so that we can get it in the next route
	            next(); 
	            //If decoded then call next() so that respective route is called.  
          	}
      });
      }
      else{
      	response.error.tokenaccess = 'Token required';
      	response.error.message = 'No Token, access denied';
      	res.status(403).send(response.error);
      }
  };


async function createNewApt(apt){
  console.log('createNewApt called');
  let newApt = new Appointment;
  newApt.lastname = apt.aptName;
  newApt.email = apt.aptEmail;
  newApt.time = apt.aptTime;
  newApt.duration = apt.aptDuration;
  newApt.save(function(err, created){
    if(err){
      return err;
    }
    else{
      console.log('from createNewApt : newApt well saved,', created);
    }
  })
}

async function updateSlot(apt, newStatus){
  console.log('updateSlot called');
  Slot.findOne({'_id': apt.aptSlot._id}, (err, updated) => {
    if (err){
      return err
    }
    else {
      updated.status = newStatus;
      updated.save(function(err){
        if (err){
          return err
        }
        else {
        console.log('from updateSlot: here is the slot to updated:', updated);
        }
      });
    }
  })
}


async function confirmApt(apt, booked, res) {
  let newAptcreated = await createNewApt(apt);
  let slotUpdated = await updateSlot(apt, booked);
  sendReply(newAptcreated, slotUpdated, res);
  console.log('async works');
  
}


  export {
    response,
    checkToken,
    createNewApt,
    confirmApt,
    updateSlot,
    sendReply
  }