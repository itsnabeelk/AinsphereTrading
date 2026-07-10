import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MailsService, ContactSubmission, CareerApplication } from '../../../service/mails.service';
import { API_BASE_URL } from '../../../core/api.config';
declare var bootstrap: any;

@Component({
  selector: 'app-dashboard-mails',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-mails.html',
  styleUrl: './dashboard-mails.css'
})
export class DashboardMails implements OnInit {
  contacts: ContactSubmission[] = [];
  careers: CareerApplication[] = [];
  activeTab: 'contacts' | 'careers' = 'contacts';
  
  selectedContact: ContactSubmission | null = null;
  selectedCareer: CareerApplication | null = null;

  constructor(private mailsService: MailsService) { }

  ngOnInit(): void {
    this.loadContacts();
    this.loadCareers();
  }

  loadContacts(): void {
    this.mailsService.getContacts().subscribe({
      next: (res) => this.contacts = res,
      error: (err) => console.error('Error loading contacts:', err)
    });
  }

  loadCareers(): void {
    this.mailsService.getCareers().subscribe({
      next: (res) => this.careers = res,
      error: (err) => console.error('Error loading careers:', err)
    });
  }

  changeTab(tab: 'contacts' | 'careers'): void {
    this.activeTab = tab;
  }

  getCvUrl(cvPath: string): string {
    if (!cvPath) return '';
    return `${API_BASE_URL}${cvPath}`;
  }

  openContactModal(contact: ContactSubmission): void {
    this.selectedContact = contact;
    const modal = new bootstrap.Modal(document.getElementById('contactMailModal'));
    modal.show();
  }

  openCareerModal(career: CareerApplication): void {
    this.selectedCareer = career;
    const modal = new bootstrap.Modal(document.getElementById('careerMailModal'));
    modal.show();
  }

  deleteContact(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this message?')) {
      this.mailsService.deleteContact(id).subscribe({
        next: () => {
          this.loadContacts();
        },
        error: (err) => console.error('Error deleting contact:', err)
      });
    }
  }

  deleteCareer(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this application?')) {
      this.mailsService.deleteCareer(id).subscribe({
        next: () => {
          this.loadCareers();
        },
        error: (err) => console.error('Error deleting career:', err)
      });
    }
  }
}
