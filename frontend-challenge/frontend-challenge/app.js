// Tennis Court Review App
class TennisCourtApp {
    constructor() {
        this.courts = tennisCourtData.courts;
        this.filteredCourts = [...this.courts];
        this.currentFilter = 'all';
        this.currentCourt = null;

        this.init();
    }

    init() {
        this.bindEvents();
        this.renderCourts();
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Filter buttons
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target.dataset.filter);
            });
        });

        // Back button
        const backBtn = document.getElementById('back-btn');
        backBtn.addEventListener('click', () => {
            this.showCourtsPage();
        });
    }

    handleSearch(query) {
        const searchTerm = query.toLowerCase().trim();

        if (searchTerm === '') {
            this.filteredCourts = this.filterByType(this.courts, this.currentFilter);
        } else {
            const searchResults = this.courts.filter(court => 
                court.name.toLowerCase().includes(searchTerm) ||
                court.location.toLowerCase().includes(searchTerm) ||
                court.surface.toLowerCase().includes(searchTerm) ||
                court.type.toLowerCase().includes(searchTerm)
            );
            this.filteredCourts = this.filterByType(searchResults, this.currentFilter);
        }

        this.renderCourts();
    }

    handleFilter(filter) {
        this.currentFilter = filter;

        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Apply search with new filter
        const searchInput = document.getElementById('search-input');
        this.handleSearch(searchInput.value);
    }

    filterByType(courts, filter) {
        if (filter === 'all') return courts;

        return courts.filter(court => {
            switch (filter) {
                case 'outdoor':
                case 'indoor':
                    return court.type === filter;
                case 'clay':
                case 'hard':
                case 'grass':
                    return court.surface === filter;
                default:
                    return true;
            }
        });
    }

    renderCourts() {
        const courtsList = document.getElementById('courts-list');

        if (this.filteredCourts.length === 0) {
            courtsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>No courts found</h3>
                    <p>Try adjusting your search or filters</p>
                </div>
            `;
            return;
        }

        courtsList.innerHTML = this.filteredCourts.map(court => `
            <div class="court-card" onclick="app.showCourtDetail(${court.id})">
                <div class="court-header">
                    <div>
                        <div class="court-name">${court.name}</div>
                        <div class="court-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${court.location}
                        </div>
                    </div>
                    <div class="rating">
                        <span class="stars">${this.renderStars(court.rating)}</span>
                        <span>${court.rating}</span>
                        <span class="text-muted">(${court.reviewCount})</span>
                    </div>
                </div>
                
                <div class="court-info">
                    <div class="info-item">
                        <i class="fas fa-tennis-ball"></i>
                        ${court.surface.charAt(0).toUpperCase() + court.surface.slice(1)}
                    </div>
                    <div class="info-item">
                        <i class="fas fa-${court.type === 'indoor' ? 'building' : 'sun'}"></i>
                        ${court.type.charAt(0).toUpperCase() + court.type.slice(1)}
                    </div>
                    <div class="info-item">
                        <i class="fas fa-dollar-sign"></i>
                        ${court.priceRange}
                    </div>
                </div>
                
                <div class="court-tags">
                    <span class="tag surface-${court.surface}">${court.surface}</span>
                    <span class="tag type-${court.type}">${court.type}</span>
                    ${court.amenities.slice(0, 2).map(amenity => 
                        `<span class="tag">${amenity}</span>`
                    ).join('')}
                </div>
            </div>
        `).join('');
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    showCourtDetail(courtId) {
        this.currentCourt = this.courts.find(court => court.id === courtId);
        if (!this.currentCourt) return;

        document.getElementById('courts-page').classList.remove('active');
        document.getElementById('court-detail-page').classList.add('active');
        document.getElementById('court-title').textContent = this.currentCourt.name;

        this.renderCourtDetail();
    }

    renderCourtDetail() {
        const court = this.currentCourt;
        const detailContent = document.getElementById('court-detail-content');

        detailContent.innerHTML = `
            <div class="detail-hero">
                <div class="detail-name">${court.name}</div>
                <div class="detail-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${court.location}
                </div>
                <div class="detail-rating">
                    <span class="stars">${this.renderStars(court.rating)}</span>
                    <span class="rating-large">${court.rating}</span>
                    <span class="text-muted">(${court.reviewCount} reviews)</span>
                </div>
                <p>${court.description}</p>
            </div>
            <div class="detail-info">
                <div class="info-card">
                    <div class="info-value">${court.surface.charAt(0).toUpperCase() + court.surface.slice(1)}</div>
                    <div class="info-label">Surface</div>
                </div>
                <div class="info-card">
                    <div class="info-value">${court.type.charAt(0).toUpperCase() + court.type.slice(1)}</div>
                    <div class="info-label">Type</div>
                </div>
                <div class="info-card">
                    <div class="info-value">${court.priceRange}</div>
                    <div class="info-label">Price Range</div>
                </div>
                <div class="info-card">
                    <div class="info-value">${court.amenities.length}</div>
                    <div class="info-label">Amenities</div>
                </div>
            </div>
            <div class="reviews-section">
                <div class="section-title">
                    Reviews
                    <button class="add-review-btn" onclick="app.toggleReviewForm()">
                        <i class="fas fa-plus"></i> Add Review
                    </button>
                </div>
                
                <div class="review-form" id="review-form">
                    <div class="form-group">
                        <label class="form-label">Your Name</label>
                        <input type="text" class="form-input" id="reviewer-name" placeholder="Enter your name">
                    </div>
                    <div class="form-group">
                        <label class="form-label">Rating</label>
                        <div class="rating-input" id="rating-input">
                            ${[1,2,3,4,5].map(i => `
                                <button type="button" class="star-btn" data-rating="${i}">
                                    <i class="fas fa-star"></i>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Your Review</label>
                        <textarea class="form-textarea" id="review-text" placeholder="Share your experience..."></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-primary" onclick="app.submitReview()">Submit Review</button>
                        <button type="button" class="btn btn-secondary" onclick="app.toggleReviewForm()">Cancel</button>
                    </div>
                </div>
                <div id="reviews-list">
                    ${this.renderReviews(court.reviews)}
                </div>
            </div>
        `;

        this.bindReviewFormEvents();
    }

    bindReviewFormEvents() {
        const starBtns = document.querySelectorAll('.star-btn');
        starBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rating = parseInt(e.currentTarget.dataset.rating);
                this.setRating(rating);
            });
        });
    }

    setRating(rating) {
        const starBtns = document.querySelectorAll('.star-btn');
        starBtns.forEach((btn, index) => {
            if (index < rating) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        this.selectedRating = rating;
    }

    renderReviews(reviews) {
        if (reviews.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-comments"></i>
                    <h4>No reviews yet</h4>
                    <p>Be the first to review this court!</p>
                </div>
            `;
        }

        return reviews.map(review => `
            <div class="review">
                <div class="review-header">
                    <div>
                        <div class="reviewer-name">${review.author}</div>
                        <div class="stars">${this.renderStars(review.rating)}</div>
                    </div>
                    <div class="review-date">${new Date(review.date).toLocaleDateString()}</div>
                </div>
                <div class="review-text">${review.text}</div>
            </div>
        `).join('');
    }

    toggleReviewForm() {
        const form = document.getElementById('review-form');
        form.classList.toggle('active');

        if (form.classList.contains('active')) {
            document.getElementById('reviewer-name').focus();
        }
    }

    submitReview() {
        const name = document.getElementById('reviewer-name').value.trim();
        const text = document.getElementById('review-text').value.trim();
        const rating = this.selectedRating;

        if (!name || !text || !rating) {
            alert('Please fill in all fields and select a rating.');
            return;
        }

        const newReview = {
            id: Date.now(),
            author: name,
            rating: rating,
            date: new Date().toISOString().split('T')[0],
            text: text
        };

        this.currentCourt.reviews.unshift(newReview);
        this.currentCourt.reviewCount++;

        // Recalculate average rating
        const totalRating = this.currentCourt.reviews.reduce((sum, review) => sum + review.rating, 0);
        this.currentCourt.rating = Math.round((totalRating / this.currentCourt.reviews.length) * 10) / 10;

        // Clear form
        document.getElementById('reviewer-name').value = '';
        document.getElementById('review-text').value = '';
        this.selectedRating = 0;
        document.querySelectorAll('.star-btn').forEach(btn => btn.classList.remove('active'));

        // Hide form and refresh reviews
        this.toggleReviewForm();
        document.getElementById('reviews-list').innerHTML = this.renderReviews(this.currentCourt.reviews);

        // Update the rating display
        document.querySelector('.detail-rating').innerHTML = `
            <span class="stars">${this.renderStars(this.currentCourt.rating)}</span>
            <span class="rating-large">${this.currentCourt.rating}</span>
            <span class="text-muted">(${this.currentCourt.reviewCount} reviews)</span>
        `;
    }

    showCourtsPage() {
        document.getElementById('court-detail-page').classList.remove('active');
        document.getElementById('courts-page').classList.add('active');
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TennisCourtApp();
});
