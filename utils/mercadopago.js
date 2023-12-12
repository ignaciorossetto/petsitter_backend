// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';
import config from './config.js';
// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken:config.mercadoPago.accessToken});

export const preference = new Preference(client);

export const newPreferenceId = async(service) => {
    let preferenceID
    const _preferenceID = {
        items: [{
            title: 'Servicio de cuidado',
            quantity: 1,
            unit_price: service?.paymentInfo?.totalPrice,
            currency_id: "ARS",
          }],
        back_urls: {
          success: `${config.frontEndUrl}/cart-status?mpago=success`,
          pending: `${config.frontEndUrl}/cart-status?mpago=pending`,
          failure: `${config.frontEndUrl}/cart-status?mpago=failure`,
        },
        auto_return: "approved",
        notification_url: `${process.env.MERCADO_WEBHOOK_TEST}/api/v1/carts/mercadopago/webhook`,
      };
      const res = await preference.create({ body: _preferenceID });
      preferenceID = res.id;
      return preferenceID
}
