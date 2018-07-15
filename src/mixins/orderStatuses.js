export default {
  live: {
    50: 'sentToServer' ,
    100: 'receivedByServer',
    200: 'sentToKitchen',
    300: 'receivedByKitchen'
  },
  resolved: {
    999: 'rejectedByKitchen',
    400: 'acceptedByKitchen',
    998: 'paymentFailed',
    500: 'paymentSuccessful',
    600: 'refunded',
    1000: 'enRouteToCustomer'
  }
}