import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { PollutionServiceService } from '../pollution-service.service';
import { Pollution } from '../models/pollution';
import { PollutionDetailsComponent } from '../pollution-details/pollution-details.component';
import { PollutionCreateFormComponent } from '../pollution-create-form/pollution-create-form.component';

@Component({
  selector: 'app-pollution-list', 
  imports: [CommonModule, RouterModule, FormsModule, PollutionDetailsComponent, PollutionCreateFormComponent],
  templateUrl: './pollution-list.component.html',
  styleUrl: './pollution-list.component.css', 
  providers: [PollutionServiceService]
})  
export class PollutionListComponent implements OnInit {

  pollutions$: Observable<Pollution[]>;
  selectedPollutionId: number | null = null;
  titreSearch: string = '';
  typePollutionSearch: string = '';
  availableTypes: string[] = ['Air', 'Eau', 'Chimique', 'Autre'];
  isCreating: boolean = false;

  constructor(private pollutionService: PollutionServiceService, private router: Router) {}

  ngOnInit(): void {
    this.pollutions$ = this.pollutionService.getPollutions();
  }

  deletePollution(id: number): void {
    this.pollutionService.deletePollution(id).subscribe(() => {
      this.pollutions$ = this.pollutionService.getPollutions();
      if (this.selectedPollutionId === id) {
        this.selectedPollutionId = null;
      }
    });
  }

  showDetails(pollutionId: number): void {
    this.selectedPollutionId = pollutionId;
  }

  hideDetails(): void {
    this.selectedPollutionId = null;
  }

  TitleSearch(): void {
    if (this.titreSearch.trim() === '') {      
      this.pollutions$ = this.pollutionService.getPollutions();
    } else {      
      this.pollutions$ = this.pollutionService.getPollutionsBy('', this.titreSearch);
      console.log(this.pollutions$);
    }
  }

  filterPollutions(): void {
    if (this.titreSearch.trim() === '' && this.typePollutionSearch === '') {
      this.pollutions$ = this.pollutionService.getPollutions();
    } else {
      this.pollutions$ = this.pollutionService.getPollutionsBy(this.typePollutionSearch, this.titreSearch);
    }
  }

  clearFilters(): void {
    this.titreSearch = '';
    this.typePollutionSearch = '';
    this.pollutions$ = this.pollutionService.getPollutions();
  }  

  editPollution(pollutionId: number): void {
    this.router.navigate(['/pollutions/edit', pollutionId]);
  }
  
  startCreating(): void { 
    this.isCreating = true;
    this.selectedPollutionId = null;
    this.router.navigate(['/pollutions/create']);
  }

  onPollutionCreated($event: Event) {
    this.isCreating = false;
    this.pollutions$ = this.pollutionService.getPollutions();
  }
}

