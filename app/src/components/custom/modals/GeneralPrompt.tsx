import ActionButton from '../../bcgov/ActionButton';
import { buttonStyles } from '../../bcgov/ButtonStyles';
import { modalStyles } from './modalStyles';

/**
 * @interface
 * @description Properties passed to the GeneralPrompt component.
 * @property {() => void} handler - The action taken when prompt is confirmed.
 * @property {string} title - The title of the modal popup.
 * @property {string[]} blurb - The text in the body of the modal.
 * @property {string} id - The id assigned to this modal.
 */
interface GeneralPromptProps {
  handler: () => void;
  title: string;
  blurb: string[];
  id: string;
}

/**
 * @description A modal element that can be used to confirm actions.
 * @param {GeneralPromptProps} props The properties passed to the component.
 * @returns A React component.
 */
const GeneralPrompt = (props: GeneralPromptProps) => {
  const { handler, title, blurb, id } = props;
  return (
    <dialog id={id} style={modalStyles.standardModalStyle}>
      <h4
        style={{
          marginBottom: '1em',
        }}
      >
        {title}
      </h4>
      {blurb.map((paragraph, index) => {
        const key = `blurb${title}${index}`;
        return (
          <p key={key} style={{ textAlign: 'start' }}>
            {paragraph}
          </p>
        );
      })}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '2em',
        }}
      >
        <ActionButton
          style={buttonStyles.secondary}
          handler={() => {
            const thisDialog: HTMLDialogElement = document.querySelector(`#${id}`)!;
            thisDialog.close();
          }}
        >
          Cancel
        </ActionButton>
        <ActionButton style={buttonStyles.primary} handler={handler}>
          Confirm
        </ActionButton>
      </div>
    </dialog>
  );
};

export default GeneralPrompt;
