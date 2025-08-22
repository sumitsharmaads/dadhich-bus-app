// Import all models to ensure they are registered with Mongoose
import './audit.model';
import './booking.model';
import './bus.model';
import './city.model';
import './country.model';
import './faqs.model';
import './seatHold.model';
import './seo.model';
import './session.model';
import './state.model';
import './terms.model';
import './tour.model';
import './totp.model';
import './user.model';
import './webauthn.model';
import './website.model';

// Export models for use in other parts of the application
export { Tour } from './tour.model';
export { User } from './user.model';
export { Bus } from './bus.model';
export { Booking } from './booking.model';
export { City } from './city.model';
export { State } from './state.model';
export { Country } from './country.model';
export { Website } from './website.model';
export { Seo } from './seo.model';
export { Terms } from './terms.model';
export { FAQ } from './faqs.model';
export { Session } from './session.model';
export { TotpSecret } from './totp.model';
export { WebAuthnCredential } from './webauthn.model';
export { SeatHold } from './seatHold.model';
export { Audit } from './audit.model';
