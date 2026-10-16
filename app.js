'use strict';
const form = document.querySelector('#service-form');
const fields = document.querySelector('#fields');
let mode = 'personal';
const services = ['Oil change', 'Brakes', 'Battery', 'Diagnostics / check engine light', 'Recall', 'Other'];
function field(id, label, type = 'text', required = false, attrs = '') {
  return `<div class="field"><label for="${id}">${label}${required ? ' *' : ''}</label><input id="${id}" name="${id}" type="${type}" ${required ? 'required' : ''} ${attrs} aria-describedby="${id}-error"><p class="error" id="${id}-error" hidden></p></div>`;
}
function select(id, label, options, required = false) {
  return `<div class="field"><label for="${id}">${label}${required ? ' *' : ''}</label><select id="${id}" name="${id}" ${required ? 'required' : ''} aria-describedby="${id}-error"><option value="">Select an option</option>${options.map(x => `<option>${x}</option>`).join('')}</select><p class="error" id="${id}-error" hidden></p></div>`;
}
function section(title, content) { return `<fieldset class="form-section"><legend>${title}</legend>${content}</fieldset>`; }
function render() {
  const fleet = mode === 'fleet';
  const contact = fleet ? field('company', 'Company name', 'text', true, 'autocomplete="organization"') + field('contact', 'Contact name and title', 'text', true, 'autocomplete="name"') : field('name', 'Full name', 'text', true, 'autocomplete="name"');
  const location = field('address', fleet ? 'Service address' : 'Where the vehicle will be (street address)', 'text', true, 'autocomplete="street-address"') + field('zip', 'ZIP', 'text', true, 'inputmode="numeric" autocomplete="postal-code" pattern="[0-9]{5}" maxlength="5"');
  const vehicle = fleet ? field('count', 'Number of vehicles', 'number', true, 'min="1" step="1" inputmode="numeric"') + field('types', 'Vehicle types', 'text', true, 'placeholder="e.g., 4 Ram ProMasters, 2 F-150s"') : `<div class="row">${field('year', 'Vehicle year', 'number', true, 'min="1900" max="2100" step="1" inputmode="numeric"')}${field('make', 'Make', 'text', true)}</div>` + field('model', 'Model', 'text', true) + field('mileage', 'Approximate mileage', 'number', false, 'min="0" step="1" inputmode="numeric"');
  const choices = fleet ? [...services, 'Preventive maintenance program'] : services;
  const service = `<fieldset class="checks"><legend>${fleet ? 'Services' : 'Service'} needed *</legend>${choices.map((s,i) => `<label class="check"><input type="checkbox" name="services" id="service-${i}" value="${s}" aria-describedby="services-error"><span>${s}</span></label>`).join('')}<p class="error" id="services-error" hidden></p></fieldset><div id="other-wrap" hidden>${field('other', 'Tell us what you need', 'text', true)}</div>`;
  const scheduling = fleet ? select('frequency', 'How often', ['One-time', 'Weekly', 'Monthly', 'Not sure'], true) + field('days', 'Preferred days', 'text', false, 'placeholder="e.g., Mondays and Wednesdays"') : field('date', 'Preferred date', 'date') + select('window', 'Preferred time window', ['Morning', 'Midday', 'Afternoon']);
  fields.innerHTML = section('01 / YOUR DETAILS', contact + field('phone', 'Phone', 'tel', true, 'autocomplete="tel"') + field('email', 'Email', 'email', true, 'autocomplete="email"')) + section('02 / LOCATION & VEHICLE', location + vehicle) + section('03 / SERVICE & TIMING', service + scheduling + '<div class="field"><label for="notes">Notes</label><textarea id="notes" name="notes" placeholder="Anything else we should know?"></textarea></div>');
  document.querySelector('#other').disabled = true;
  document.querySelector('#error-summary').hidden = true;
  document.querySelector('#consent-error').hidden = true;
  document.querySelector('#consent').removeAttribute('aria-invalid');
  document.querySelectorAll('.toggle button').forEach(b => b.setAttribute('aria-pressed', String(b.id === `${mode}-toggle`)));
}
function error(el, message) {
  el.setAttribute('aria-invalid', String(Boolean(message)));
  const output = document.getElementById(`${el.id}-error`);
  if (output) { output.textContent = message; output.hidden = !message; }
}
function validate(el) {
  let message = '';
  if (el.required && (el.type === 'checkbox' ? !el.checked : !el.value.trim())) message = el.type === 'checkbox' ? 'Please agree to be contacted before submitting.' : 'Please complete this field.';
  else if (el.value && el.id === 'zip' && !/^\d{5}$/.test(el.value)) message = 'Enter a 5-digit ZIP code.';
  else if (el.value && el.id === 'phone' && !/^[+()\d\s.\-]+$/.test(el.value)) message = 'Enter a valid phone number.';
  else if (el.value && el.id === 'phone' && el.value.replace(/\D/g, '').length < 10) message = 'Enter a phone number with at least 10 digits.';
  else if (!el.validity.valid) message = el.type === 'email' ? 'Enter a valid email address.' : `Enter a whole number${el.min ? ' of at least ' + el.min : ''}${el.max ? ' and no more than ' + el.max : ''}.`;
  error(el, message); return !message;
}
function serviceValidation() {
  const checked = Boolean(form.querySelector('[name="services"]:checked'));
  const output = document.querySelector('#services-error');
  output.hidden = checked; output.textContent = checked ? '' : 'Choose at least one service.';
  form.querySelectorAll('[name="services"]').forEach(el => el.setAttribute('aria-invalid', String(!checked)));
  return checked;
}
document.querySelectorAll('.toggle button').forEach(b => b.addEventListener('click', () => { const next = b.id.startsWith('fleet') ? 'fleet' : 'personal'; if (next !== mode) { mode = next; render(); } }));
form.addEventListener('change', e => {
  if (e.target.id === 'service-5') { const on = e.target.checked; document.querySelector('#other-wrap').hidden = !on; document.querySelector('#other').disabled = !on; }
  if (e.target.name === 'services' && !document.querySelector('#services-error').hidden) serviceValidation();
});
form.addEventListener('input', e => {
  if (e.target.getAttribute('aria-invalid') === 'true' && e.target.name !== 'services') validate(e.target);
});
form.addEventListener('submit', e => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll('input:not([name="services"]), select, textarea').forEach(el => { if (!el.disabled && !validate(el)) valid = false; });
  if (!serviceValidation()) valid = false;
  const summary = document.querySelector('#error-summary'); summary.hidden = valid;
  if (!valid) { summary.textContent = 'Please check the marked fields below.'; form.querySelector('[aria-invalid="true"]').focus(); return; }
  // Deliberately no network request, storage, analytics, or form serialization.
  form.reset(); fields.innerHTML = ''; document.querySelector('#request-content').hidden = true; document.querySelector('#confirmation').hidden = false; document.querySelector('#confirmation-title').focus();
});
document.querySelector('.restart').addEventListener('click', () => { document.querySelector('#confirmation').hidden = true; document.querySelector('#request-content').hidden = false; render(); document.querySelector(`#${mode}-toggle`).focus(); });
document.querySelector('#privacy-link').addEventListener('click', e => { e.preventDefault(); document.querySelector('#privacy').hidden = !document.querySelector('#privacy').hidden; });
render();

// Service-area map (Leaflet + OpenStreetMap tiles). Polygon = his stated limits.
window.addEventListener('load', () => {
  if (!window.L) return;
  const el = document.querySelector('#service-map'); if (!el) return;
  const map = L.map(el, { scrollWheelZoom: false, dragging: !L.Browser.mobile, tap: false, attributionControl: true });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 12, attribution: '&copy; OpenStreetMap contributors' }).addTo(map);
  const area = [
    [38.3566,-121.9877], // Vacaville (north-west)
    [38.4088,-121.3716], // Elk Grove (north)
    [38.20,-120.85],     // foothills
    [37.9841,-120.3822], // Sonora (east)
    [37.4849,-119.9663], // Mariposa (east)
    [36.9613,-120.0607], // Madera (south)
    [37.0058,-121.5683], // Gilroy
    [37.3382,-121.8863], // San Jose
    [37.5485,-121.9886], // Fremont
    [37.7249,-122.1561], // San Leandro
    [37.9358,-122.3477], // Richmond (west)
    [38.1041,-122.2566]  // Vallejo
  ];
  const zone = L.polygon(area, { color: '#0066b3', weight: 2, fillColor: '#0066b3', fillOpacity: 0.18 }).addTo(map);
  L.circleMarker([37.4947,-120.8466], { radius: 7, color: '#111', weight: 2, fillColor: '#fff', fillOpacity: 1 }).addTo(map).bindTooltip('Turlock', { permanent: true, direction: 'top', offset: [0,-6] });
  map.fitBounds(zone.getBounds(), { padding: [12, 12] });
});
