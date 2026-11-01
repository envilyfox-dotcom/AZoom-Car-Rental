// ===== A. POPUP MESSAGE =====
const dialog = document.getElementById('msgDialog');

function showMessage(text) {
  document.getElementById('msgText').textContent = text;
  dialog.showModal();
}

document.getElementById('msgClose').addEventListener('click', function () {
  dialog.close();
});

// ===== B. LOGIN =====
const users = [
  { username: 'customer', password: 'cust123', role: 'customer' },
  { username: 'staff',    password: 'staff123', role: 'staff' }
];

const currentUser = JSON.parse(localStorage.getItem('user'));

// Change "Login" to "Logout" when someone is logged in
const loginLink = document.getElementById('loginLink');
if (currentUser) {
  loginLink.textContent = 'Logout (' + currentUser.username + ')';
  loginLink.addEventListener('click', function (e) {
    e.preventDefault();
    localStorage.removeItem('user');
    window.location.href = 'index.html';
  });
}
// ----- Staff menu -----
if (currentUser && currentUser.role === 'staff') {
  document.body.classList.add('staff');      

  // "Reserve" becomes "Inspect Order"
  const reserveLink = document.querySelector('nav a[href="booking.html"]');
  reserveLink.textContent = 'Inspect Car';
  reserveLink.href = 'inspection.html';

  // "Pay Bill" becomes "Order Details"
  document.querySelector('nav a[href="payment.html"]').textContent = 'Order Details';
}

const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', function (e) {
    e.preventDefault();   // stop the page from reloading
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (!user) {
      showMessage('Wrong username or password. Please try again.');
      return;
    }
    localStorage.setItem('user', JSON.stringify(user));
    // Staff go to inspection, customers go to booking
    window.location.href = user.role === 'staff' ? 'inspection.html' : 'booking.html';
  });
}

// ===== C. BOOKING =====
const prices = {
  leaf:  { daily: 95,  weekly: 560, monthly: 1980 },
  tesla: { daily: 160, weekly: 950, monthly: 3390 },
  ioniq: { daily: 150, weekly: 890, monthly: 3190 },
  atto3: { daily: 125, weekly: 740, monthly: 2590 },
  smart:     { daily: 70, weekly: 420, monthly: 1490 },
  seal:      { daily: 165, weekly: 980, monthly: 3490 },
  ev9:       { daily: 210, weekly: 1260, monthly: 4490 },
  m6:        { daily: 140, weekly: 830, monthly: 2990 },
  eqv:       { daily: 230, weekly: 1380, monthly: 4890 },
  evito:     { daily: 220, weekly: 1320, monthly: 4690 },
  cyberster: { daily: 280, weekly: 1680, monthly: 5990 },
  taycan:    { daily: 350, weekly: 2100, monthly: 7490 }
};

const carDetails = {
  leaf:  { name: 'Nissan Leaf', range: 270, seats: 5, type: 'Hatchback', category: 'Economy', luggage: '2 bags',
           desc: 'A compact, easy-to-park hatchback. Ideal for city errands and short trips.',
           features: ['Bluetooth', 'Apple CarPlay / Android Auto', 'Reversing camera', 'Air conditioning'] },
  tesla: { name: 'Tesla Model 3', range: 513, seats: 5, type: 'Sedan', category: 'Sedan', luggage: '3 bags',
           desc: 'A sleek sedan with long range and a minimalist touchscreen interior.',
           features: ['Bluetooth', 'Built-in navigation', 'Lane-keeping assist', 'Glass roof'] },
  ioniq: { name: 'Hyundai Ioniq 5', range: 480, seats: 5, type: 'Crossover', category: 'SUV', luggage: '4 bags',
           desc: 'A spacious crossover with ultra-fast charging. Great for families.',
           features: ['Bluetooth', 'Apple CarPlay / Android Auto', 'Ultra-fast charging', 'Power socket for devices'] },
  atto3: { name: 'BYD Atto 3', range: 420, seats: 5, type: 'Compact SUV', category: 'SUV', luggage: '3 bags',
           desc: 'A compact SUV with a high seating position and a roomy boot.',
           features: ['Bluetooth', 'Panoramic sunroof', 'Rotating touchscreen', 'Reversing camera'] },
  smart: { name: 'Smart EQ fortwo', range: 130, seats: 2, type: 'City Car', category: 'Economy', luggage: '1 bag',
           desc: 'A tiny two-seater that fits into any parking spot. Perfect for quick solo or couple trips around town.',
           features: ['Bluetooth', 'Smartphone integration', 'Air conditioning', 'Tight turning circle'] },
  seal: { name: 'BYD Seal', range: 570, seats: 5, type: 'Sedan', category: 'Sedan', luggage: '3 bags',
           desc: 'A sporty electric sedan with long range and a smooth, quiet ride.',
           features: ['Bluetooth', 'Apple CarPlay / Android Auto', 'Rotating touchscreen', 'Glass roof'] },
  ev9: { name: 'Kia EV9', range: 505, seats: 7, type: 'Large SUV', category: 'SUV', luggage: '4 bags',
           desc: 'A large 7-seat SUV with three rows of seats. Ideal for big families and group trips.',
           features: ['Bluetooth', 'Apple CarPlay / Android Auto', 'Ultra-fast charging', 'Third-row seating'] },
  m6: { name: 'BYD M6', range: 420, seats: 7, type: 'MPV', category: 'MPV', luggage: '4 bags',
           desc: 'A practical 7-seat MPV with flexible seating and plenty of space for families.',
           features: ['Bluetooth', 'Apple CarPlay / Android Auto', 'Rotating touchscreen', 'Rear air-con vents'] },
  eqv: { name: 'Mercedes-Benz EQV', range: 356, seats: 8, type: 'Van', category: 'MPV', luggage: '6 bags',
           desc: 'A premium 8-seat people mover with a comfortable cabin. Great for groups and airport runs.',
           features: ['Bluetooth', 'Built-in navigation', 'Sliding doors on both sides', 'Reversing camera'] },
  evito: { name: 'Mercedes-Benz eVito Tourer', range: 358, seats: 9, type: 'Van', category: 'MPV', luggage: '6 bags',
           desc: 'A roomy 9-seat van that carries a whole team and their luggage in one trip.',
           features: ['Bluetooth', 'Apple CarPlay / Android Auto', 'Sliding side door', 'Reversing camera'] },
  cyberster: { name: 'MG Cyberster', range: 443, seats: 2, type: 'Roadster', category: 'Luxury', luggage: '1 bag',
           desc: 'A two-seat electric sports roadster with scissor doors and a fold-down roof.',
           features: ['Bluetooth', 'Apple CarPlay / Android Auto', 'Electric soft top', 'Scissor doors'] },
  taycan: { name: 'Porsche Taycan', range: 590, seats: 4, type: 'Sports Sedan', category: 'Luxury', luggage: '2 bags',
           desc: 'A luxury electric sports car with thrilling performance and a premium interior.',
           features: ['Bluetooth', 'Built-in navigation', 'Adaptive cruise control', 'Premium sound system'] }
};

const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  // Only logged-in customers can book
  if (!currentUser) {
    window.location.href = 'login.html';        
  } else if (currentUser.role === 'staff') {
    window.location.href = 'inspection.html';    
  }

  function calculatePrice() {
    const car = document.getElementById('car').value;
    const period = document.getElementById('period').value;
    const duration = Number(document.getElementById('duration').value);
    if (!car || !period) return 0;   
    const total = prices[car][period] * duration;
    document.getElementById('totalPrice').textContent = '$' + total;
    return total;
  }

  // Recalculate whenever something changes
  bookingForm.addEventListener('change', calculatePrice);

    // Show the chosen car's photo and description on the right
  const carSelect = document.getElementById('car');
  const carInfo = document.getElementById('carInfo');

  function showCarInfo() {
    const car = carSelect.value;
    if (!car) {                 
      carInfo.hidden = true;
      return;
    }
    const info = carDetails[car];
    document.getElementById('carImage').src = 'images/' + car + '.jpg';
    document.getElementById('carImage').alt = info.name;
    document.getElementById('carName').textContent = info.name;
    document.getElementById('carSub').textContent =
      info.type + ' · Automatic · Range ' + info.range + ' km';
    document.getElementById('carTags').innerHTML =
      '<span class="tag">' + info.category + '</span>' +
      '<span class="tag">' + info.seats + ' seats</span>';
    document.getElementById('carDesc').textContent = info.desc;
    document.getElementById('carPrice').innerHTML =
      '$' + prices[car].daily + '<span>/day</span>';
    document.getElementById('carOtherPrices').textContent =
      '$' + prices[car].weekly + '/week · $' + prices[car].monthly + '/month';
    carInfo.hidden = false;
  }

  carSelect.addEventListener('change', showCarInfo);

  // Auto-select the car chosen on the Our Cars page, and lock it
  const params = new URLSearchParams(window.location.search);
  const chosenCar = params.get('car');      // e.g. "tesla"
  if (chosenCar) {
    carSelect.value = chosenCar;
    if (carSelect.value === chosenCar) {    // only lock if that car is in the list
      carSelect.disabled = true;            // can't change the car
      document.querySelector('label[for="car"]').textContent = 'Car Model';
    }
    calculatePrice();
    showCarInfo();
  }
    // Pickup date: no dates before today
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');   // months start at 0
  const dd = String(today.getDate()).padStart(2, '0');
  document.getElementById('pickupDate').min = yyyy + '-' + mm + '-' + dd;

    // Show the duration box and change its label for the chosen period
  const periodSelect = document.getElementById('period');
  const durationBox = document.getElementById('durationBox');
  const durationLabel = document.getElementById('durationLabel');

  const periodWords = { daily: 'days', weekly: 'weeks', monthly: 'months' };

  periodSelect.addEventListener('change', function () {
    const period = periodSelect.value;
    if (period) {
      durationLabel.textContent = 'How many ' + periodWords[period] + '?';
      const maxDuration = { daily: 6, weekly: 4, monthly: 12 };
      document.getElementById('duration').max = maxDuration[period];
      durationBox.hidden = false;           // show the box
    } else {
      durationBox.hidden = true;            // back to "-- Select --": hide it
    }
  });

  bookingForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiry = document.getElementById('cardExpiry').value;
    const cvv = document.getElementById('cardCvv').value;

    if (!/^\d{16}$/.test(cardNumber)) { showMessage('Card number must be 16 digits.'); return; }
    if (!/^\d{2}\/\d{2}$/.test(expiry)) { showMessage('Expiry must be in MM/YY format.'); return; }
    if (!/^\d{3}$/.test(cvv)) { showMessage('CVV must be 3 digits.'); return; }

    // Save the booking so the other pages can use it
    const booking = {
      ref: 'AZ' + Math.floor(1000 + Math.random() * 9000),
      car: document.getElementById('car').selectedOptions[0].text,
      branch: document.getElementById('branch').value,
      date: document.getElementById('pickupDate').value,
      period: document.getElementById('period').value,
      duration: Number(document.getElementById('duration').value),
      rate: prices[document.getElementById('car').value][document.getElementById('period').value],
      rental: calculatePrice(),
      damage: 0,
      status: 'Reserved',
      card: {                                                    // ← new
        name: document.getElementById('cardName').value.trim().toUpperCase(),
        last4: cardNumber.slice(-4),                             // only the last 4 digits
        expiry: expiry
      }
    };
    localStorage.setItem('booking', JSON.stringify(booking));

    showMessage('Reservation confirmed! Your reference is ' + booking.ref +
                '. Please collect your car at ' + booking.branch + '.');
    bookingForm.reset();
    carInfo.hidden = true;
    document.getElementById('totalPrice').textContent = '$0';
    durationBox.hidden = true;

    carSelect.disabled = false;
  });
}

// ===== D. INSPECTION =====
const inspectionForm = document.getElementById('inspectionForm');
if (inspectionForm) {
  if (!currentUser || currentUser.role !== 'staff') {
    window.location.href = 'login.html';
  }

  const booking = JSON.parse(localStorage.getItem('booking'));
  if (booking) {
    document.getElementById('bookingRef').value = booking.ref;
  }

  function damageTotal() {
    let total = 0;
    document.querySelectorAll('.damage:checked').forEach(box => {
      total += Number(box.value);
    });
    document.getElementById('damageTotal').textContent = '$' + total;
    return total;
  }

  inspectionForm.addEventListener('change', damageTotal);

  inspectionForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!booking) { showMessage('No booking found to inspect.'); return; }
    booking.damage = damageTotal();
    booking.damageItems = [];
    document.querySelectorAll('.damage:checked').forEach(box => {
      booking.damageItems.push({ name: box.dataset.name, cost: Number(box.value) });
    });
    booking.status = 'Inspected';
    localStorage.setItem('booking', JSON.stringify(booking));
    showMessage('Inspection saved. Final bill sent to the customer.');
  });
}

// ===== E. PAYMENT =====
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
  const booking = JSON.parse(localStorage.getItem('booking'));

  if (booking) {
    document.getElementById('billRef').textContent = booking.ref;
    document.getElementById('billRental').textContent = '$' + booking.rental;
    document.getElementById('billDamage').textContent = '$' + booking.damage;
    document.getElementById('billTotal').textContent = '$' + (booking.rental + booking.damage);
  }

    // Show or hide the detailed bill
  const detailsBtn = document.getElementById('detailsBtn');
  const billDetails = document.getElementById('billDetails');
  const periodWords = { daily: 'day', weekly: 'week', monthly: 'month' };

  detailsBtn.addEventListener('click', function () {
    if (!booking) { showMessage('No booking found.'); return; }

    // Row 1: the car and how the rental price was worked out
    let word = periodWords[booking.period];
    if (booking.duration > 1) word += 's';
    let rows = '<tr><td>Car rental</td><td>' + booking.car + ' · ' + booking.duration + ' ' + word +
               ' × $' + booking.rate + '</td><td>$' + booking.rental + '</td></tr>';

    // One row per damage
    const items = booking.damageItems || [];
    if (booking.status === 'Reserved') {
      rows += '<tr><td>Damages</td><td>Waiting for inspection</td><td>-</td></tr>';
    } else if (items.length === 0) {
      rows += '<tr><td>Damages</td><td>No damage found</td><td>$0</td></tr>';
    } else {
      items.forEach(function (item) {
        rows += '<tr><td>Damage</td><td>' + item.name + '</td><td>$' + item.cost + '</td></tr>';
      });
    }

    // Total
    rows += '<tr><td colspan="2"><strong>Total</strong></td><td><strong>$' +
            (booking.rental + booking.damage) + '</strong></td></tr>';

    document.getElementById('detailRows').innerHTML = rows;
    billDetails.hidden = !billDetails.hidden;
    detailsBtn.textContent = billDetails.hidden ? 'View details' : 'Hide details';
  });

  // Show the card saved at reservation
  if (booking && booking.card) {
    document.getElementById('payCard').value =
      '**** **** **** ' + booking.card.last4 + ' · ' + booking.card.name + ' · exp ' + booking.card.expiry;
  }

  paymentForm.addEventListener('submit', function (e) {
    e.preventDefault();
        if (!booking) {
      showMessage('You have no outstanding bill.');
      return;
    }
    if (booking.status !== 'Inspected') {
      showMessage('Your bill is not ready yet. Please wait for the car inspection.');
      return;
    }

    if (!booking.card) {
      showMessage('No saved card was found for this booking.');
      return;
    }
    const cvv = document.getElementById('payCvv').value;
    if (!/^\d{3}$/.test(cvv)) {
      showMessage('Please enter the 3-digit CVV of your card ending ' + booking.card.last4 + '.');
      return;
    }

        // Paid: clear the bill
    localStorage.removeItem('booking');
    showMessage('Payment successful! Thank you for choosing AZoom. Your bill has been cleared.');

    // When the popup is closed, reload so the page shows the empty bill
    dialog.addEventListener('close', function () {
      window.location.reload();
    }, { once: true });
  });
}

// ===== F. HERO SLIDESHOW (home page) =====
const heroSlides = document.getElementById('heroSlides');
if (heroSlides) {
  const total = heroSlides.children.length;   // includes the copy of the first photo
  let index = 0;

  setInterval(function () {
    index++;
    heroSlides.style.transition = 'transform 0.6s ease';          // quick slide
    heroSlides.style.transform = 'translateX(-' + index * 100 + '%)';

    // Reached the copy of the first photo: jump back to the real one, without animation
    if (index === total - 1) {
      setTimeout(function () {
        heroSlides.style.transition = 'none';
        heroSlides.style.transform = 'translateX(0)';
        index = 0;
      }, 700);   // just after the 0.6s slide finishes
    }
  }, 3000);      // move every 3 seconds
}

// ===== G. CAR SEARCH & FILTER (Our Cars page) =====
const carSearch = document.getElementById('carSearch');
if (carSearch) {
  const typeFilter = document.getElementById('typeFilter');
  const seatFilter = document.getElementById('seatFilter');
  const noResults = document.getElementById('noResults');
  const carCards = document.querySelectorAll('.card-grid .card');

  function filterCars() {
    const text = carSearch.value.trim().toLowerCase();
    const type = typeFilter.value;
    const seats = seatFilter.value;
    let shown = 0;

    carCards.forEach(function (card) {
      const name = card.querySelector('h3').textContent.toLowerCase();
      const matchName = name.includes(text);
      const matchType = type === '' || card.dataset.type === type;
      const matchSeats = seats === '' || card.dataset.seats === seats;

      const show = matchName && matchType && matchSeats;
      card.hidden = !show;          // hide cards that don't match
      if (show) shown++;
    });

    noResults.hidden = shown > 0;   // message only when nothing matches
  }

  carSearch.addEventListener('input', filterCars);    // runs on every key you type
  typeFilter.addEventListener('change', filterCars);
  seatFilter.addEventListener('change', filterCars);
}

// ===== H. CAR DETAILS POPUP (Our Cars page) =====
const carDialog = document.getElementById('carDialog');
if (carDialog) {

  function showCarDetails(car) {
    const info = carDetails[car];
    document.getElementById('detailName').textContent = info.name;
    document.getElementById('detailOverview').textContent = info.desc;

    document.getElementById('specSeats').textContent = info.seats + ' passengers';
    document.getElementById('specLuggage').textContent = info.luggage;
    document.getElementById('specRange').textContent = info.range + ' km';
    document.getElementById('specType').textContent = info.type;

    let list = '';
    info.features.forEach(function (feature) {
      list += '<li>' + feature + '</li>';
    });
    document.getElementById('detailFeatures').innerHTML = list;

    document.getElementById('priceDaily').textContent = '$' + prices[car].daily + '/day';
    document.getElementById('priceWeekly').textContent = '$' + prices[car].weekly + '/week';
    document.getElementById('priceMonthly').textContent = '$' + prices[car].monthly + '/month';

    document.getElementById('detailReserve').href = 'booking.html?car=' + car;
    carDialog.showModal();
  }

  // Every Details button opens the popup for its own car
  document.querySelectorAll('[data-car]').forEach(function (button) {
    button.addEventListener('click', function () {
      showCarDetails(button.dataset.car);
    });
  });

  document.getElementById('detailClose').addEventListener('click', function () {
    carDialog.close();
  });
}