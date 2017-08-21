import 'jquery.payment';

Template.payment.onRendered(function() {
  let template = this;

  template.subscribe('payments');
  template.subscribe('sources');
  template.subscribe('organization');
  $('#card-number').payment('formatCardNumber');
  $('#expiry').payment('formatCardExpiry');
  $('#cvc').payment('formatCardCVC');

  const stripe = Stripe(Meteor.settings.public.stripe.testPubKey);
  const elements = stripe.elements();
  // Custom styling can be passed to options when creating an Element.
  const style = {
    base: {
      // Add your base input styles here. For example:
      fontSize: '16px',
      lineHeight: '24px',
    },
  };
  // Create an instance of the card Element
  const card = elements.create('card', {style});
  // Add an instance of the card Element into the `card-element` <div>
  card.mount('.form-group');
  card.addEventListener('change', ({error}) => {
  const displayError = document.getElementById('card-errors');
  if (error) {
    displayError.textContent = error.message;
  } else {
    displayError.textContent = '';
  }
});
// Create a token or display an error when the form is submitted.
const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const {token, error} = await stripe.createToken(card);

  if (error) {
    // Inform the user if there was an error
    const errorElement = document.getElementById('card-errors');
    errorElement.textContent = error.message;
  } else {
    // Send the token to your server
    // stripeTokenHandler(token);
    Meteor.call('stripeTokenHandler', token, function(error, result) {
      if (error) {
        console.log(error);
        Bert.alert('Woah, something went wrong!', 'danger', 'growl-top-right', 'fa-frown-o');
      } else {
        // console.log(result);
        Bert.alert('Success!', 'success', 'growl-top-right', 'fa-check');
        $('#payment-modal').modal('hide');
        $('.js-add-card')[0].reset();
      }
    })

  }
});
  });

Template.payment.events({
  'keyup #card-number'(event) {
    let cardtype = $.payment.cardType(event.target.value);
    Session.set('cardType', cardtype);
  }
  // 'submit .js-add-card'(event) {
  //   event.preventDefault();
  //   console.log('form event');
  //   const target = event.target;
  //   const ccNumberUnformated = target.cc_number.value;
  //   const ccNumber = ccNumberUnformated.replace(/\s/g, '');
  //   const ccExpiry = $.payment.cardExpiryVal(target.cc_expiry.value);
  //   const ccCvc = target.cc_cvc.value;
  //   // let card = {
  //   //   cc_number: ccNumber,
  //   //   exp_month: ccExpiry.month,
  //   //   exp_year: ccExpiry.year,
  //   //   cvc: ccCvc
  //   // }
  //   let cardNumber = elements.create('cardNumber');
  //   cardNumber.mount('#card-number');
  //   let cardExpiry = elements.create('cardExpiry');
  //   cardExpiry.mount('#expiry');
  //   let cardCvc = elements.create('cardCvc');
  //   cardCvc.mount('#cvc');
  //
  //   stripe.createToken(cardNumber).then(function(result) {
  //     console.log(result, 'result');
  //   })
  // }
});

Template.payment.helpers({
  whichCard() {
    let cardType = Session.get('cardType');
    if (cardType == null) {
      return "<img src='/icons/credit.png'>";
    } else {
      return "<img class='addon-card-img' src='/icons/"+cardType+".png'>"
    }
  },
  organization() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      return Organizations.findOne(user.organizationId);
    }
  },
  getAccountStatusLabel: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      let organization = Organizations.findOne(user.organizationId);
      if (organization) {
        if (organization.subscription.status == "trialing") {
          return '<div class="ui black label">Trialing</div>'
        } else if (organization.subscription.status == "active") {
          return '<div class="ui green label">Active</div>'
        }
      }
    }
  },
  getAccountStatusDate: function() {
    let user = Meteor.users.findOne(Meteor.userId());
    if (user) {
      let organization = Organizations.findOne(user.organizationId);
      if (organization) {
        return moment.unix(organization.subscription.current_period_end).format("MMM DD, YYYY");
      }
    }
  },
  getLast4ofCard(customerId) {
    let source = Sources.findOne({'data.object.customer': customerId});
    return source.data.object.last4;
  },
  creditCardIcon(customerId) {
    let source = Sources.findOne({'data.object.customer': customerId});
    if (source.data.object.brand == 'Visa') {
      return '/icons/visa.png';
    } else if (source.data.object.brand == 'Discover') {
      return '/icons/discover.png'
    } else if (source.data.object.brand == 'Mastercard') {
      return '/icons/mastercard.png'
    } else if (source.data.object.brand == 'American Express') {
      return '/icons/amex.png'
    } else if(source.data.object.brand == 'Diners Club') {
      return '/icons/dinersclub.png'
    } else if (source.data.object.brand == 'JCB') {
      return '/icons/jcb.png'
    }
  },
  hasSource(customerId) {
    console.log('customer id', customerId);
    let source = Sources.findOne({'data.object.customer': customerId});
    console.log('has source', source);
    if (source) {
      return true
    } else {
      return false
    }
  },
  getPayments(customerId) {
    return Payments.find({});
  },
  getPaymentDate(timestamp) {
    console.log(timestamp);
    return moment.unix(timestamp).format("MMM DD, YYYY");
  },
  getPaymentAmount(amount) {
    // let cents = amount.toString();
    let dollar = (amount/100).toFixed( 2 );
    return '$' + dollar.toString();
  },
  getStartDate(date) {
    if (date) {
      return moment.unix(date).format("MMM DD, YYYY");
    }
  },
  getEndDate(date) {
    if (date) {
      return moment.unix(date).format("MMM DD, YYYY");
    }
  }
});
