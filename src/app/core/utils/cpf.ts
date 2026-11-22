export const onlyDigits = (value: string) => value.replace(/\D/g, '');

/** "52998224725" -> "529.982.247-25" (formata enquanto digita). */
export function formatCpf(value: string): string {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

/** Confere o tamanho e os dois dígitos verificadores. */
export function isValidCpf(value: string): boolean {
  const d = onlyDigits(value);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const digit = (length: number) => {
    const sum = d.slice(0, length).split('').reduce((acc, n, i) => acc + Number(n) * (length + 1 - i), 0);
    return ((sum * 10) % 11) % 10;
  };
  return digit(9) === Number(d[9]) && digit(10) === Number(d[10]);
}
