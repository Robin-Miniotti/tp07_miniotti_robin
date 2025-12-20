import { Component, inject, OnInit, Signal } from '@angular/core';
import { Pollution } from '../models/pollution';
import { PollutionService } from '../services/pollution-service';
import { map, Observable } from 'rxjs';
import { Card } from "primeng/card";
import { CommonModule } from '@angular/common';
import { Fieldset } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { Toast } from "primeng/toast";
import { ConfirmationService, MessageService } from 'primeng/api';
import { Image } from "primeng/image";
import { ConfirmDialog } from 'primeng/confirmdialog';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TypePollution } from '../models/type-pollution';
import { Select } from 'primeng/select';
import { TypePollutionLabelPipe } from '../pipes/type-pollution-label.pipe';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@ngxs/store';
import { UserFavorisState } from '../../shared/states/user-favoris-state';
import { Auth } from '../../shared/models/auth';
import { AuthState } from '../../shared/states/auth-state';
import { AddFavorite, RemoveFavorite } from '../../shared/actions/user-favoris-action';
import { ListePollutionItem } from "../liste-pollution-item/liste-pollution-item";

@Component({
  selector: 'app-liste-pollution',
  imports: [Card, CommonModule, ButtonModule, Toast, Select, ConfirmDialog, 
    InputText, FormsModule, RouterModule, ProgressSpinner, ListePollutionItem],
  templateUrl: './liste-pollution.html',
  styleUrl: './liste-pollution.css',
  providers: [MessageService, ConfirmationService]
})
export class ListePollution implements OnInit {

  listePollution$?: Observable<Pollution[]>;
  filtreTitre: string = '';
  filtreType: string = '';
  filtreLieu: string = '';
  typePollutionOptions = Object.entries(TypePollution).map(([key, value]) => ({
    label: value,
    value: key
  }));

  private store = inject(Store);

  utilisateurConnecte: Signal<Auth | undefined> = toSignal(this.store.select(AuthState.getConnectedUser), {
    initialValue: undefined,
  });

  favoris = toSignal(this.store.select(UserFavorisState.getFavoritesByUserId).pipe(map(fn => fn(this.utilisateurConnecte()?.id)) ),
    { initialValue: [] as string[] }
  );

  constructor(private pollutionService : PollutionService, private messageService: MessageService, 
    private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.loadAllPollutions();
  }

  loadAllPollutions() {
    this.listePollution$ = this.pollutionService.getAll().pipe(
      map(pollutions => pollutions.sort((a, b) => a.titre.localeCompare(b.titre))));
  }

  filtrer() {
    this.listePollution$ = this.pollutionService.getAll({
      titre: this.filtreTitre,
      typePollution: this.filtreType,
      lieu: this.filtreLieu
    }).pipe(
      map(pollutions => pollutions.sort((a, b) => a.titre.localeCompare(b.titre))));
  }

  resetFiltres() {
    this.filtreTitre = '';
    this.filtreType = '';
    this.filtreLieu = '';
    this.loadAllPollutions();
  }

  deletePollution(event: Event, id: string) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Voulez-vous supprimer cette pollution ?',
        header: 'Supprimer une pollution',
        icon: 'pi pi-info-circle',
        acceptIcon: 'pi pi-check',
        rejectIcon: 'pi pi-times',
        rejectButtonProps: { label: 'Annuler', severity: 'secondary' },
        acceptButtonProps: { label: 'Supprimer', severity: 'danger' },
        accept: () => {
          this.pollutionService.deleteById(id).subscribe({
          next: () => {
            this.messageService.add({ severity: 'info', detail: 'Pollution supprimée' });
            window.location.href = '/';
          },
          error: (err) => {
            console.error("Erreur lors de la suppression :", err);
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: `Erreur lors de la suppression\nCause : ${err.error.message}` });
          }
        });
      }
    });
  }

  isUtilisateurConnecte() : boolean {
    return this.utilisateurConnecte() !== undefined;
  }

  isPollutionFavoris(pollutionId: string): boolean {
    return this.favoris().includes(pollutionId);
  }

  addToFavoris(pollutionId: string) {
    this.store.dispatch(new AddFavorite(this.utilisateurConnecte()!.id!, pollutionId));
  }

  removeFromFavoris(pollutionId: string) {
    this.store.dispatch(new RemoveFavorite(this.utilisateurConnecte()!.id!, pollutionId));
  }

  onRemovePollutionFromFavoris($event: Pollution) {
    const pollutionId = $event.id;
    this.removeFromFavoris(pollutionId);
  }
}
