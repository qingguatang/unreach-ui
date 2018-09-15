import React from 'react';
import $t from 'prop-types';
import ReactDOM from 'react-dom';
import cx from 'classnames';


const ModalView = ({
  title,
  buttons,
  closable,
  body,
  onAction,
  closeOnOverlayClick,
  modalClassName = 'modal',
  modalMaskClassName = 'modal-mask',
  modalContainerClassName = 'modal-container',
  modalHeaderClassName = 'modal-header',
  modalTitleClassName = 'modal-title',
  modalBodyClassName = 'modal-body',
  modalFooterClassName = 'modal-footer'
}) => (
  <div className={cx(modalClassName)}>
    <div className={modalMaskClassName} onClick={() => closeOnOverlayClick && onAction('close') } />
    <div className={modalContainerClassName}>
      {title &&
      <header className={modalHeaderClassName}>
        <div className={modalTitleClassName}>{title}</div>
        { closable && <button className="delete" onClick={() => onAction('close')} /> }
      </header>
      }
      <section className={modalBodyClassName}>{body}</section>
      {
        buttons && buttons.length &&

          <footer className={modalFooterClassName}>
          {
            buttons.map((button, index) => (
              <button key={index} className={cx('button', button.className)} disabled={button.disabled}
                      onClick={() => onAction(button.name)}>{button.label}</button>
            ))
          }
        </footer>
      }
    </div>
  </div>
);


ModalView.propTypes = {
  title: $t.string,
  buttons: $t.array,
  closable: $t.bool,
  body: $t.string,
  onAction: $t.func.isRequired,
  closeOnOverlayClick: $t.bool,
  modalClassName: $t.string,
  modalMaskClassName: $t.string,
  modalContainerClassName: $t.string,
  modalHeaderClassName: $t.string,
  modalTitleClassName: $t.string,
  modalBodyClassName: $t.string,
  modalFooterClassName: $t.string
};


class Modal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    document.body.appendChild(this.el);
    focus(this.el);
  }

  componentWillUnmount() {
    // ReactDOM.unmountComponentAtNode(this.el);
    this.el.parentNode.removeChild(this.el);
  }

  render() {
    const props = {
      ...this.props,
      body: this.props.body || this.props.children
    };
    const node = <ModalView {...props} />;
    return ReactDOM.createPortal(node, this.el);
  }
}


function focus(root) {
  const el = root.querySelector('.has-focus,.is-primary');
  el && el.focus();
}


class CommonModal extends React.PureComponent {
  state = {
    isOpen: true
  }

  onAction = name => {
    this.setState({ isOpen: false });
    this.props.onClose();
    this.props.onAction(name);
  }

  render() {
    return this.state.isOpen ? <Modal {...this.props} onAction={this.onAction} /> : null;
  }
}

function show(opts) {
  const div = document.createElement('div');
  document.body.appendChild(div);
  const onClose = () => {
    ReactDOM.unmountComponentAtNode(div);
    div.parentNode.removeChild(div);
  };
  ReactDOM.render(<CommonModal {...opts} onClose={onClose} />, div);
}


function confirm(opts) {
  const buttons = [
    { label: opts.cancelLabel || '取消', name: 'cancel' },
    { label: opts.confirmLabel || '确定', name: 'confirm', className: 'is-primary' }
  ];

  return new Promise(resolve => {
    const onAction = name => resolve(name === 'confirm');
    show({ closable: true, closeOnOverlayClick: true, buttons, onAction, ...opts });
  });
}


function info(opts) {
  const buttons = [
    { label: '确定', name: 'confirm', className: 'is-primary' }
  ];
  return confirm({ buttons, ...opts });
}


export { show, confirm, info };
export default Modal;
