class TaskBoard {
  constructor() {
    this.draggedEl = null;
    this.ghostEl = null;
    this.currenciesBlock = null;
    this.modal = document.querySelector('.modal');
    this.button = document.querySelectorAll('.adding-list');
    this.field = document.querySelector('.field');
    this.create = document.querySelector('.create');
  }

  onDrag() {
    document.addEventListener('mousedown', (e) => {
      e.preventDefault();
      if (!e.target.classList.contains('content')) {
        return;
      }
      this.ghostEl = e.target.cloneNode(true);
      this.draggedEl = e.target;
      this.ghostEl.style.position = 'absolute';
      this.ghostEl.style.zIndex = 1000;
      this.ghostEl.style.width = window.getComputedStyle(e.target.parentNode).getPropertyValue('width');
      this.ghostEl.style.left = `${e.pageX - this.ghostEl.offsetWidth / 2.5}px`;
      this.ghostEl.style.top = `${e.pageY - this.ghostEl.offsetHeight / 2}px`;
      document.body.appendChild(this.ghostEl);
    });
  }

  onMove() {
    document.addEventListener('mousemove', (e) => {
      e.preventDefault();
      if (!this.draggedEl) {
        return;
      }
      this.ghostEl.style.left = `${e.pageX - this.ghostEl.offsetWidth / 2}px`;
      this.ghostEl.style.top = `${e.pageY - this.ghostEl.offsetHeight / 2}px`;
    });
  }

  dragEnd() {
    document.addEventListener('mouseup', (e) => {
      e.preventDefault();
      if (!this.draggedEl) {
        return;
      }
      this.ghostEl.style.position = '';
      this.ghostEl.style.width = '';
      const closet = document.elementFromPoint(e.pageX, e.pageY);
      if (closet.classList.contains('card')) {
        closet.appendChild(this.draggedEl);
        document.body.removeChild(this.ghostEl);
        this.ghostEl = null;
        this.draggedEl = null;
      } else {
        document.body.removeChild(this.ghostEl);
        this.ghostEl = null;
        this.draggedEl = null;
      }
    });
  }

  moving() {
    this.onDrag();
    this.onMove();
    this.dragEnd();
  }

  openModal() {
    this.button.forEach((x) => {
      x.addEventListener('click', (e) => {
        this.modal.style.display = 'block';
        this.currenciesBlock = document.querySelector(`[data-id = "${e.target.parentElement.dataset.number}"]`);
      });
    });
  }

  createItem() {
    this.openModal();
    this.create.addEventListener('click', (e) => {
      e.preventDefault();
      this.modal.style.display = 'none';
      this.currenciesBlock.insertAdjacentHTML('afterbegin', `<div class="content">${this.field.value}</div>`);
    });
  }
}

const board = new TaskBoard();

board.moving();
board.createItem();
