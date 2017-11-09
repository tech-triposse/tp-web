var Insta = require('instamojo-nodejs');
Insta.setKeys('3da770878f35a914e0a52a9eb7ae9dfd', '03f8cecbfb673ac4425546dfeecf7a8e');

var data = new Insta.PaymentData();

data.purpose = "Test";
data.amount = 10;
data.setRedirectUrl('https://www.instamojo.com/@triposse/');
module.exports.create_payment = function(){
   Insta.createPayment(data, function(error, response) {
    if (error) {
      // some error
    } else {
      // Payment redirection link at response.payment_request.longurl
      console.log(response);
    }
  });
}
