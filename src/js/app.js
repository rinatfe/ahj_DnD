class TaskBoard {
  constructor() {
    this.draggedEl = null;
    this.ghostEl = null;
    this.currenciesBlock = null;
    this.modal = document.querySelector('.modal');
    this.button = document.querySelectorAll('.adding-list');
    this.field = document.querySelector('.field');
    this.create = document.querySelector('.create');
    this.close = document.querySelector('.close');
    this.board = document.querySelector('.board');

    this.onLoad = this.onLoad.bind(this);
    this.dragEnd = this.dragEnd.bind(this);
    this.createItem = this.createItem.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  onLoad() {
    if (localStorage.length) {
      document.addEventListener('DOMContentLoaded', () => {
        this.board.innerHTML = '';
        this.board.innerHTML = localStorage.getItem('test');
      });
    } else { /* eslint-disable */
      return;
    }
  }

  onDrag() {
    document.addEventListener('mousedown', (e) => {
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
      this.ghostEl.style.cursor = 'grabbing';
      document.body.appendChild(this.ghostEl);
    });
  }

  onMove() {
    document.addEventListener('mousemove', (e) => {
      if (e.target.classList.contains('content')) {
        e.target.firstElementChild.style.display = 'block';
      }

      if (!this.draggedEl) {
        return;
      }
      this.ghostEl.style.left = `${e.pageX - this.ghostEl.offsetWidth / 2}px`;
      this.ghostEl.style.top = `${e.pageY - this.ghostEl.offsetHeight / 2}px`;
    });
  }

  onLeave() { /* eslint-disable */
    document.addEventListener('mouseout', (e) => {
      if (e.target.classList.contains('content') && !document.elementFromPoint(e.pageX, e.pageY).classList.contains('remove-item')) {
        e.target.firstElementChild.style.display = 'none';
      } else {
        return;
      }
    });
  }

  dragEnd() {
    document.addEventListener('mouseup', (e) => {
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
        localStorage.setItem('test', this.board.innerHTML);
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
    this.onLeave();
    this.dragEnd();
  }

  openModal() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('adding-list')) {
        this.modal.style.display = 'block';
        this.currenciesBlock = document.querySelector(`[data-id = "${e.target.parentElement.dataset.number}"]`);
      }
    });
  }

  closeModal() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('close')) {
        this.modal.style.display = 'none';
      }
    });
  }

  createItem() {
    this.openModal();
    this.closeModal();
    this.create.addEventListener('click', () => {
      this.modal.style.display = 'none';
      this.currenciesBlock.insertAdjacentHTML('afterbegin', `<div class="content">${this.field.value}<span class="remove-item">×</span></div>`);
      this.field.value = '';
      localStorage.setItem('test', this.board.innerHTML);
    });
  }

  remove() {
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('remove-item')) {
        e.target.parentElement.remove();
        localStorage.setItem('test', this.board.innerHTML);
      } else { /* eslint-disable */
        return;
      }
    });
  }
}

const board = new TaskBoard();
board.onLoad();
board.moving();
board.createItem();
board.remove();
