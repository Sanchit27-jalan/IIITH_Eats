
(function() {
    "use strict";

    const select = (el, all = false) => {
      el = el.trim()
      if (all) {
        return [...document.querySelectorAll(el)]
      } else {
        return document.querySelector(el)
      }
    }

    const on = (type, el, listener, all = false) => {
      let selectEl = select(el, all)
      if (selectEl) {
        if (all) {
          selectEl.forEach(e => e.addEventListener(type, listener))
        } else {
          selectEl.addEventListener(type, listener)
        }
      }
    }

    const onscroll = (el, listener) => {
      el.addEventListener('scroll', listener)
    }

    let navbarlinks = select('#navbar .scrollto', true)
    const navbarlinksActive = () => {
      let position = window.scrollY + 200
      navbarlinks.forEach(navbarlink => {
        if (!navbarlink.hash) return
        let section = select(navbarlink.hash)
        if (!section) return
        if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
          navbarlink.classList.add('active')
        } else {
          navbarlink.classList.remove('active')
        }
      })
    }
    window.addEventListener('load', navbarlinksActive)
    onscroll(document, navbarlinksActive)

    const scrollto = (el) => {
      let header = select('#header')
      let offset = header.offsetHeight
  
      let elementPos = select(el).offsetTop
      window.scrollTo({
        top: elementPos - offset,
        behavior: 'smooth'
      })
    }

    let selectHeader = select('#header')
    let selectTopbar = select('#topbar')
    if (selectHeader) {
      const headerScrolled = () => {
        if (window.scrollY > 100) {
          selectHeader.classList.add('header-scrolled')
          if (selectTopbar) {
            selectTopbar.classList.add('topbar-scrolled')
          }
        } else {
          selectHeader.classList.remove('header-scrolled')
          if (selectTopbar) {
            selectTopbar.classList.remove('topbar-scrolled')
          }
        }
      }
      window.addEventListener('load', headerScrolled)
      onscroll(document, headerScrolled)
    }

    let backtotop = select('.back-to-top')
    if (backtotop) {
      const toggleBacktotop = () => {
        if (window.scrollY > 100) {
          backtotop.classList.add('active')
        } else {
          backtotop.classList.remove('active')
        }
      }
      window.addEventListener('load', toggleBacktotop)
      onscroll(document, toggleBacktotop)
    }

    on('click', '.mobile-nav-toggle', function(e) {
      select('#navbar').classList.toggle('navbar-mobile')
      this.classList.toggle('bi-list')
      this.classList.toggle('bi-x')
    })

    on('click', '.navbar .dropdown > a', function(e) {
      if (select('#navbar').classList.contains('navbar-mobile')) {
        e.preventDefault()
        this.nextElementSibling.classList.toggle('dropdown-active')
      }
    }, true)

    on('click', '.scrollto', function(e) {
      if (select(this.hash)) {
        e.preventDefault()
  
        let navbar = select('#navbar')
        if (navbar.classList.contains('navbar-mobile')) {
          navbar.classList.remove('navbar-mobile')
          let navbarToggle = select('.mobile-nav-toggle')
          navbarToggle.classList.toggle('bi-list')
          navbarToggle.classList.toggle('bi-x')
        }
        scrollto(this.hash)
      }
    }, true)

    window.addEventListener('load', () => {
      if (window.location.hash) {
        if (select(window.location.hash)) {
          scrollto(window.location.hash)
        }
      }
    });

    let preloader = select('#preloader');
    if (preloader) {
      window.addEventListener('load', () => {
        preloader.remove()
      });
    }

    window.addEventListener('load', () => {
      let menuContainer = select('.menu-container');
      if (menuContainer) {
        let menuIsotope = new Isotope(menuContainer, {
          itemSelector: '.menu-item',
          layoutMode: 'fitRows'
        });
  
        let menuFilters = select('#menu-flters li', true);
  
        on('click', '#menu-flters li', function(e) {
          e.preventDefault();
          menuFilters.forEach(function(el) {
            el.classList.remove('filter-active');
          });
          this.classList.add('filter-active');
  
          menuIsotope.arrange({
            filter: this.getAttribute('data-filter')
          });
          menuIsotope.on('arrangeComplete', function() {
            AOS.refresh()
          });
        }, true);
      }
  
    });
  

    const glightbox = GLightbox({
      selector: '.glightbox'
    });
  

    new Swiper('.events-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    });
  
 
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 20
        },
  
        1200: {
          slidesPerView: 3,
          spaceBetween: 20
        }
      }
    });

    const galleryLightbox = GLightbox({
      selector: '.gallery-lightbox'
    });
 
    window.addEventListener('load', () => {
      AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false
      })
    });
  
  })()
function fetchCartData() {
  fetch('http://localhost:8000/cart')
    .then(response => response.json())
    .then(data => {
      const table = document.getElementsByClassName("table")[0];
      if (table.rows.length > 0) {
        for (let i = table.rows.length - 1; i > 0; i--) {
          table.deleteRow(i);
        }
      }
      for (let i = 0; i < data.length; i++){
        const row = document.createElement("tr");
        const item = document.createElement("td");
        item.textContent = data[i]['item'];
        row.appendChild(item);
        const quantity = document.createElement("td");
        quantity.textContent = data[i]['count'] !== undefined ? data[i]['count'] : '';
        row.appendChild(quantity);
        table.appendChild(row);
      }
    })
    .catch(error => {
      console.error(error);
    });
}

window.addEventListener('load', () => {
  const buttons = document.querySelectorAll('.add_button');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const menuItem = button.parentElement;
      const dishName = menuItem.querySelector('h4').textContent;
      const price = menuItem.querySelector('.price').textContent;
      const data = {
        dish: dishName,
        price: price
      };
      fetch('http://localhost:8000/endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            fetchCartData();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
  });
});
  window.addEventListener('load', () => {
    const buttons = document.querySelectorAll('.remove_button');
  
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const menuItem = button.parentElement;
        const dishName = menuItem.querySelector('h4').textContent;
        const price = menuItem.querySelector('.price').textContent;
        const data = {
          dish: dishName,
          price: price
        };
        fetch('http://localhost:8000/remove', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
          })
          .then(response => response.json())
          .then(data => {
              console.log(data);
              fetchCartData();
          })
          .catch(error => {
              console.error('Error:', error);
          });
      });
    });
  

  const form = document.getElementById("contact-form");

  form.addEventListener("submit", (event) => {
    event.preventDefault(); 

    const name = document.getElementById("name").value;
    const contactNumber = document.getElementById("contact-number").value;
    const canteen_name=document.getElementsByTagName('title')[0].textContent;
    const data={
      canteen: canteen_name,
      Name: name,
      number: contactNumber
    };
    fetch('http://localhost:8000/submit', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
      })
      .catch(error => {
          console.error('Error:', error);
      });
  });

  fetchCartData();
});
