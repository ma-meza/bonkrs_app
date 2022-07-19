// require('dotenv').config();
// const Event = require('./models/eventSchema');
//
// const twilioClient = require('twilio')(
//   process.env.TWILIO_ACCOUNT_SID,
//   process.env.TWILIO_AUTH_TOKEN
// );
// const twilioService = twilioClient.notify.services(process.env.TWILIO_NOTIFY_SERVICE_SID);
// const nodemailer = require('nodemailer');
//
// var emailTransporterReminder = nodemailer.createTransport({
//   host: 'smtp.zoho.com',
//   port: 465,
//   pool: true,
//   secure: true,
//   auth: {
//     user: 'customercare@dailyworks.ca',
//     pass: 'Fortune2019',
//   },
// });
//
// function emailAppointmentReminder24HBefore(emailList, idList) {
//   //send email
//   for (var i = 0; i < emailList.length; i++) {
//     var mailOptions = {
//       from: '"Dailyworks appointment reminder" <customercare@dailyworks.ca>',
//       to: emailList[i].reminderEmail,
//       subject: 'Welcome to Dailyworks!',
//       html:
//         "<link href='https://fonts.googleapis.com/css?family=Roboto:400,900&display=swap' rel='stylesheet'><meta name='viewport' content='width=device-width, initial-scale=1.0'><div style='position:fixed;left:0;top:0;width:100%;height:500px;background-color:#f9f9f9;'><div id='whiteDiv' style='padding-bottom:30px;position:relative;margin-top:20px;left:20px;width:calc(100% - 40px); background-color:#fff;height:fit-content;min-height:100px;border-radius:10px;-webkit-box-shadow: 0px 7px 24px -6px rgba(0,0,0,0.75);  -moz-box-shadow: 0px 7px 24px -6px rgba(0,0,0,0.75);box-shadow: 0px 7px 24px -6px rgba(0,0,0,0.75);padding-top:20px;'><img src='https://dailyworks.ca/assets/logos/dwFullLogoBlack.jpg' style='border-radius:10px;position:relative;margin-bottom:40px;margin-left:20px;margin-top:0px;height:50px;'><p class='text'style='font-size:30px;color:#000;position:relative;margin:0;margin-left:20px;margin-right:20px;font-weight:900; margin-bottom:30px;'>Appointment reminder!</p><p class='text' style='font-size:20px;color:#000;position:relative;margin:0;margin-left:20px;margin-right:20px;font-weight:400;'>This is a friendly reminder for your upcoming appointment with " +
//         emailList[i].storeName +
//         "</p></div></div><style>*{font-family: 'Roboto', sans-serif;box-sizing:border-box;}</style>",
//     };
//     emailTransporterReminder.sendMail(mailOptions, function (err, info) {
//       if (err) {
//         console.log(err);
//       } else {
//         successConfirmedId.push(emailList[i]._id);
//       }
//     });
//   }
//
//   Event.updateMany({ _id: { $in: idList } }, { reminded: true }, function (
//     errorUpdate,
//     resultObjUpdate
//   ) {
//     if (errorUpdate) {
//       console.log(errorUpdate);
//     }
//   });
// }
//
// function smsAppointmentReminder24hBefore(smsList, idList) {
//   // send sms twilio
//   const bindings = smsList.map(function (number) {
//     return JSON.stringify({ binding_type: 'sms', address: number });
//   });
//   twilioService.notifications
//     .create({
//       toBinding: bindings,
//       body:
//         'Dailyworks here! Just a friendly reminder of your upcoming appointment. Vist www.dailyworks.ca/appointmentDetails for the details.',
//     })
//     .then(function (notification) {
//       if (notification.sid) {
//         Event.updateMany({ _id: { $in: idList } }, { reminded: true }, { upsert: false }, function (
//           errorUpdate,
//           resultObjUpdate
//         ) {
//           if (errorUpdate) {
//             console.log(errorUpdate);
//           }
//         });
//       }
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
//   // Event.updateMany({_id:{$in:successConfirmedId}}, {reminded:true}, {upsert:false}, function(errorUpdate, resultObjUpdate){
//   //   if(errorUpdate){
//   //     console.log(errorUpdate);
//   //   }
//   // });
// }
//
// module.exports.appointmentReminderFinder = function () {
//   var reminderStartDate = new Date();
//   var reminderEndDate = new Date();
//   reminderEndDate.setDate(reminderEndDate.getDate() + 1);
//   Event.find(
//     { startDate: { $gte: reminderStartDate }, endDate: { $lte: reminderEndDate }, reminded: false },
//     { _id: 1, clientId: 1, clientName: 1, reminderPhone: 1, reminderEmail: 1, storeName: 1 },
//     function (errorFind, resultAppointmentList) {
//       if (errorFind) {
//         console.log('error finding appts for reminder');
//       } else {
//         if (resultAppointmentList.length > 0) {
//           var emailList = [];
//           var phoneList = [];
//           var emailAppointmentIdList = [];
//           var smsAppointmentIdList = [];
//           for (var i = 0; i < resultAppointmentList.length; i++) {
//             if (resultAppointmentList[i].reminderEmail) {
//               emailList.push(resultAppointmentList[i]);
//               emailAppointmentIdList.push(resultAppointmentList[i]._id);
//             } else if (resultAppointmentList[i].reminderPhone) {
//               phoneList.push(resultAppointmentList[i].reminderPhone);
//               smsAppointmentIdList.push(resultAppointmentList[i]._id);
//             }
//           }
//           emailAppointmentReminder24HBefore(emailList, emailAppointmentIdList);
//           // smsAppointmentReminder24hBefore(phoneList, smsAppointmentIdList);
//         }
//       }
//     }
//   );
// };
//
// module.exports.deleteOlderUnconfirmedAppointmentsAndClients = function () {
//   var date12HAgo = new Date();
//   date12HAgo.setHours(date12HAgo.getHours() - 12);
//
//   Event.deleteMany({ confirmed: false, dateCreated: { $lte: date12HAgo } }, function (errorDelete) {
//     if (!errorDelete) {
//       console.log('Successfully deleted all old unconfirmed appointments.');
//     }
//   });
// };
