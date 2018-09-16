import React from 'react';
import { withState } from 'recompose';
import Modal, { confirm, info } from '@/Modal';
import bulmaClasses from '@/Modal/bulmaClasses';
import 'bulma/css/bulma.css';
import './style.scss';


const enhance = withState('isOpen', 'setOpen', false);

const App = enhance(({
  isOpen,
  setOpen,
  action
}) => (
  <div className="has-gap">
    <div className="buttons">
      <button className="button" onClick={onConfirm(action)}>打开确定对话框</button>
      <button className="button" onClick={onInfo(action)}>打开信息对话框</button>
      <button className="button" onClick={() => setOpen(true)}>自定义对话框</button>
    </div>
    { isOpen && <MyModal setOpen={setOpen} action={action} /> }
  </div>
));

App.displayName = 'simple use modal';

const Title = 'Modal - 对话框';
export { App, Title };

const MyModal = ({ setOpen, action }) => (
  <Modal title="你好" {...bulmaClasses}
         closable={true}
         buttons={[
           { label: '取消', name: 'cancel' },
           { label: '确定', name: 'confirm', className: 'is-primary' }
         ]}
         onAction={
           name => {
             setOpen(false);
             action(name);
           }
         }
         closeOnOverlayClick={true}>
    我是一个对话框
  </Modal>
);


const onConfirm = action => async() => {
  const ok = await confirm({
    title: '确定',
    body: '确定要删除此项目吗？',
    ...bulmaClasses
  });
  action('结果:', ok);
};

const onInfo = () => async() => {
  info({
    title: '提示',
    body: '你的作业已提交，我们会在24小时内Review并给你反馈。',
    ...bulmaClasses
  });
};
