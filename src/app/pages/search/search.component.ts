import { CommonModule, NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HuntsService } from '../../services/hunt.service';
import { HuntInformationViewDTO } from '../../model/hunt-information-view.dto';
import { PageDTO } from '../../model/page.dto';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { RoutePaths } from '../../config/route-paths';

@Component({
  selector: 'app-search',
  imports: [ReactiveFormsModule, CommonModule, NgFor, LoaderComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  hunts!: PageDTO<HuntInformationViewDTO>;
  page = 0;
  loading = true;
  error = '';
  currentPage = 0;
  totalPages = 0;

  constructor(
    private readonly huntsService: HuntsService,
    private readonly router: Router,
  ) {}

  public searchForm: FormGroup = this.fb.group({
    query: [''],
  });

  ngOnInit(): void {
    this.huntsService
      .getSearchHunts(
        this.page.toString(),
        '4', // Default page size
      )
      .subscribe({
        next: (data) => {
          this.totalPages = data.totalPages;
          this.currentPage = data.pageNumber;
          this.hunts = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Unable to load your hunts.';
          this.loading = false;
        },
      });
  }

  onSearch() {
    const query = this.searchForm.get('query')?.value;
    if (query) {
      console.log('Search query:', query);
      console.log('Hunts : ', this.hunts);
      //
    }
  }

  goToHunt(huntId: string) {
    this.router.navigate(['/' + RoutePaths.HUNT_DETAILS, huntId]);
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.huntsService
        .getSearchHunts(
          this.currentPage.toString(),
          '4', // Default page size
        )
        .subscribe({
          next: (data) => {
            this.hunts = data;
            this.loading = false;
          },
          error: () => {
            this.error = 'Unable to load hunts.';
            this.loading = false;
          },
        });
    }
  }
}
