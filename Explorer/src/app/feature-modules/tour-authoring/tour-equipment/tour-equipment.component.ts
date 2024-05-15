import { Component, OnInit } from '@angular/core';
import { Equipment } from '../model/equipment.model';
import { TourAuthoringService } from '../tour-authoring.service';
import { Tour } from '../model/tour.model';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { PagedResults } from 'src/app/shared/model/paged-results.model';


@Component({
  selector: 'xp-tour-equipment',
  templateUrl: './tour-equipment.component.html',
  styleUrls: ['./tour-equipment.component.css']
})
export class TourEquipmentComponent implements OnInit {

  constructor(private service: TourAuthoringService,private activatedRoute:ActivatedRoute,private router:Router) { }

  tour:Tour;
  id: string;

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params=>{
     this.id=params['id'];
     this.getTour(this.id);
   })
 }

  availableEquipment: Equipment[];
  currentEquipmentIds: string[] = [];
  isVisibleEquipment: boolean = false;
  isVisibleAvailableEquipment: boolean = false;
  showButtonText: string = 'Show equipment';
  showAvailableButtonText: string = 'Show available equipment';

  getTour(id: string): void {
    this.service.get(id).subscribe((result: Tour) => {
      this.tour = result;
      console.log(this.tour);
      if (this.tour && this.tour.equipment !== undefined) {
        if (this.tour.equipment) {
          this.currentEquipmentIds = this.tour.equipment.map(e => e.id as string);
        } else {
          this.currentEquipmentIds = [];
        }
        this.getAvailableEquipment(this.currentEquipmentIds);
      } else {
        console.error('Tour data is missing or incomplete.');
      }
    });
  }


  getAvailableEquipment(currentEquipmentIds: string[]): void{
    if (this.tour.id !== undefined) {      
      this.service.getAvailableEquipment(this.tour.id, currentEquipmentIds).subscribe((result: PagedResults<Equipment>) => {
        this.availableEquipment = result.results;
      })
    }
  }

  removeEquipment(tourId?: string, equipmentId?: string): void {
    if (tourId !== undefined && equipmentId !== undefined) {
      this.service.removeEquipment(tourId, equipmentId).subscribe({
        next: () => {
          const index = this.tour.equipment.findIndex(e => e.id === equipmentId);
          if (index !== -1) {
            this.tour.equipment.splice(index, 1);
          }
          this.currentEquipmentIds = this.tour.equipment.map(e => e.id as string);
          this.getAvailableEquipment(this.currentEquipmentIds);
        },
        error: () => {
        }
      })
    }
  }

  addEquipment(tourId?: string, equipmentId?: string): void {
    if (tourId !== undefined && equipmentId !== undefined) {
      this.service.addEquipment(tourId, equipmentId).subscribe({
        next: () => {
          const index = this.availableEquipment.findIndex(e => e.id === equipmentId);
          if (index !== -1) {
            const addedEquipment = this.availableEquipment.splice(index, 1)[0];
            this.currentEquipmentIds.push(equipmentId);
            this.tour.equipment.push(addedEquipment);
            this.getAvailableEquipment(this.currentEquipmentIds);
          }
        },
        error: () => {
        }
      })
    }
  }

  onShowEquipmentClick(): void {
    if(this.isVisibleEquipment){
      this.isVisibleEquipment = false;
      this.showButtonText = 'Show equipment';
    }
    else{
      this.isVisibleEquipment = true;
      this.showButtonText = 'Hide equipment';
    }
  }

  onShowAvailableEquipmenClick(): void {
    if(this.isVisibleAvailableEquipment){
      this.isVisibleAvailableEquipment = false;
      this.showAvailableButtonText = 'Show available equipment';
    }
    else{
      this.isVisibleAvailableEquipment = true;
      this.showAvailableButtonText = 'Hide available equipment';
    }
  }

  showCheckpoints():void{
    this.router.navigate([`checkpoint/${this.id}`]);

  }
  showTours():void{
    this.router.navigate([`tour-form/${this.id}`]);

  }
}
