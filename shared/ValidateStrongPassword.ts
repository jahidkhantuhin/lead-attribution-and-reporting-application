export const hasNumber = (value: any) => /\d+/g.test(value)

export const hasSpecialCharacter = (value: string) =>
  /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?~]/.test(value)

export const hasUppercase = (value: string) =>
  value
    .split('')
    .map((c) => /^[A-Z]*$/.test(c))
    .includes(true)

export const hasLowerCase = (value: string) =>
  value
    .split('')
    .map((c) => /^[a-z]*$/.test(c))
    .includes(true)

export default function (value: string) {
  if ((value && value.length === 0) || value === null || value === undefined) {
    return true
  }
  if (!hasNumber(value)) {
    return `This field must contain atleast one number`
  }

  if (!hasSpecialCharacter(value)) {
    return `This field must contain atleast one special character`
  }
  if (!hasUppercase(value)) {
    return `This field must contain atleast one uppercase letter`
  }

  if (!hasLowerCase(value)) {
    return `This field must contain atleast one lowercase letter`
  }

  return true
}
