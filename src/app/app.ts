import { Component, HostListener, signal, OnInit, AfterViewInit, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';

import vehiclesData from './vehicles.json';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, AfterViewInit {
  isBrowser = false;
  scrollPosition = signal(0);
  isLoaded = signal(false);

  cars = ['car1.jpeg', 'car2.jpeg', 'car3.jpeg', 'car2.jpeg', 'car1.jpeg', 'car2.jpeg', 'car3.jpeg', 'car2.jpeg', 'car1.jpeg', 'car2.jpeg', 'car3.jpeg', 'car2.jpeg', 'car1.jpeg', 'car2.jpeg', 'car3.jpeg', 'car2.jpeg', 'car1.jpeg', 'car2.jpeg', 'car3.jpeg', 'car2.jpeg'];

  // Parse details string into array if needed, otherwise use directly
  vehicles = vehiclesData.map((v: any) => ({
    ...v,
    images: Array.from({ length: v.imageCount }, (_, i) => `coches/${v.id}_${i + 1}.${v.ext || 'jpeg'}`)
  }));

  selectedVehicle = signal<any>(null);
  isVehicleModalOpen = signal<boolean>(false);
  selectedImage = signal<string | null>(null);
  isVehiclesExpanded = signal<boolean>(false);

  toggleVehicles() {
    this.isVehiclesExpanded.update(v => !v);
  }

  openVehicleDetails(vehicle: any) {
    this.selectedVehicle.set(vehicle);
    this.isVehicleModalOpen.set(true);
    document.body.style.overflow = 'hidden';

    // Wait a tick for Angular to render the *ngIf container and its slides
    setTimeout(() => {
      if (this.isBrowser) {
        const swiperEl = document.getElementById('vehicle-swiper-container') as any;
        if (swiperEl) {
          // Pass Swiper parameters directly to the element before initializing
          Object.assign(swiperEl, {
            effect: 'cards',
            grabCursor: true,
            loop: true,
          });
          // Explicitly initialize Swiper NOW, guaranteeing all slides are accounted for
          swiperEl.initialize();
        }
      }
    }, 50);
  }

  closeVehicleDetails() {
    this.isVehicleModalOpen.set(false);
    document.body.style.overflow = '';
  }

  openImage(img: string) {
    this.selectedImage.set(img);
  }

  closeImage() {
    this.selectedImage.set(null);
  }

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.selectedVehicle.set(this.vehicles[0]); // Default to first vehicle so modal can pre-render

    if (this.isBrowser) {
      import('swiper/element/bundle').then(swiper => {
        swiper.register();
      });

      // If user loads the page at the top, lock scroll for the curtain effect
      if (window.scrollY < 10) {
        document.body.style.overflow = 'hidden';
      } else {
        // If they reloaded halfway down the page, skip the curtain
        this.hasScrolledPast.set(true);
      }

      setTimeout(() => {
        this.isLoaded.set(true);
      }, 500); // 500ms delay to show the logo first, then the slogan
    }
  }

  hasScrolledPast = signal(false);
  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  scrollToContact() {
    this.isMenuOpen.set(false);
    const contactSection = document.getElementById('contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  touchStartY = 0;

  triggerCurtain() {
    if (!this.hasScrolledPast()) {
      this.hasScrolledPast.set(true);
      // Wait exactly 0.7s (the CSS transition time) before allowing native scroll
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 700);
    }
  }

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (this.isBrowser && !this.hasScrolledPast() && event.deltaY > 0) {
      this.triggerCurtain();
    }
  }

  @HostListener('window:touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (this.isBrowser && !this.hasScrolledPast()) {
      this.touchStartY = event.touches[0].clientY;
    }
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent) {
    if (this.isBrowser && !this.hasScrolledPast()) {
      const touchY = event.touches[0].clientY;
      if (this.touchStartY > touchY + 10) { // Swiped up (scrolled down)
        this.triggerCurtain();
      }
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (this.isBrowser && !this.hasScrolledPast()) {
      if (['ArrowDown', 'PageDown', 'Space'].includes(event.code)) {
        this.triggerCurtain();
      }
    }
  }

  @HostListener('window:scroll', [])
  onScroll() {
    if (this.isBrowser) {
      this.scrollPosition.set(window.scrollY);
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    }
  }
}
