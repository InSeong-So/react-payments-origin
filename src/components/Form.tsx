import type { ChangeEvent, FormEvent, ReactNode, FocusEvent } from 'react';
import type {
  FormSameNameFromTargetValidatorProps,
  FormSameNameFromTargetValidatorCallbackProps,
} from 'components';

type FormProps = {
  action?: string;
  children: ReactNode;
  onSubmit: (data: Record<string, string[]>) => void;
  onChange?: (e: ChangeEvent<HTMLFormElement>) => void;
  onBlur?: (e: FocusEvent<HTMLFormElement>) => void;
};

/**
 *
 * @param action
 * @param children 렌더링 타겟
 * @param onSubmit 최종 데이터 유효성 검사
 * @param onChange 실시간 데이터 핸들링
 * @param onBlur 각 필드별 유효성 검사(Row 단위)
 * @constructor
 */
const Form = ({ action, children, onSubmit, onChange, onBlur }: FormProps) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.target as HTMLFormElement;
    const isValid = formElement.checkValidity();

    const firstInvalidField = formElement.querySelector(':invalid') as HTMLInputElement;
    firstInvalidField?.focus();

    if (!isValid) return;

    const formInnerData = generateElementValue(formElement);
    onSubmit(formInnerData);
  };

  const handleChange = (e: ChangeEvent<HTMLFormElement>) => {
    onChange && onChange(e);
  };

  const handleBlur = (e: FocusEvent<HTMLFormElement>) => {
    onBlur && onBlur(e);
  };

  return (
    <form
      noValidate
      action={action}
      onSubmit={handleSubmit}
      onChange={handleChange}
      onBlur={handleBlur}
    >
      {children}
    </form>
  );
};

const generateElementValue = (formElement: HTMLFormElement) => {
  const entries = new FormData(formElement).entries();

  return Array.from(entries).reduce((acc, [key, value]) => {
    const emptyValue = !acc[key];
    const $value = value as string; // FIXME: FormDataEntryValue에서 타입 단언

    if (emptyValue) acc[key] = [$value];
    else acc[key].push($value);

    return acc;
  }, {} as Record<string, string[]>);
};

Form.isInputElement = (
  $target: (EventTarget & HTMLFormElement) | HTMLInputElement,
): $target is HTMLInputElement => $target instanceof HTMLInputElement;

Form.sameNameFromTargetValidator = (
  { $elements, $target, name }: FormSameNameFromTargetValidatorProps,
  callback: (props: FormSameNameFromTargetValidatorCallbackProps) => void,
) => {
  if ($target.name !== name) return;

  const targetIndex = [...$elements].findIndex((element) => element === $target);

  const sameNamesElements = [...$elements].filter((element) =>
    (element as HTMLInputElement).name.includes($target.name),
  ) as HTMLInputElement[];

  if (targetIndex === -1) return;

  callback && callback({ $elements, $target, name, sameNamesElements, targetIndex });
};

export default Form;
