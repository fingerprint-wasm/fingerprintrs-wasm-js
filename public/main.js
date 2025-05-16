import init, * as wasm from "./fingerprints/rust_pkg/wasm_app.js";
import { collectFingerprintData } from './fingerprints/js_fp/fingerprintjs_collector.js';

document.getElementById("btn-lab1").addEventListener("click", () => collect("lab1"));
document.getElementById("btn-lab2").addEventListener("click", () => collect("lab2"));
document.getElementById("btn-lab3").addEventListener("click", () => collect("lab3"));
document.getElementById("btn-lab4").addEventListener("click", () => collect("lab4"));

await init();

async function collect(labName) {
console.log("Botão clicado");
  try {
    // Trecho para coleta de dados de fingerprint em rust
    const fingerprint_Rs = await wasm.get_fingerprint();
    var fixed = removeStructNames(fixQuaseJson(removeSome(fingerprint_Rs.slice(11))));
    const fingerprintRs = JSON.parse(fixed);

    // Trecho para coleta de dados de fingerprint em js
    const fingerprintJs = await collectFingerprintData();

    await fetch('/fingerprint-rs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lab: labName, attributes: fingerprintRs })
    });

    await fetch('/fingerprint-js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lab: labName, attributes: fingerprintJs})
    });

    console.log('✅ Dados enviados para servidor com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao coletar ou enviar fingerprint:', error);
  }
}

function fixQuaseJson(quaseJson) {
  let step1 = quaseJson.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');

  let step2 = step1.replace(/:\s*([a-zA-Z_][a-zA-Z0-9_\-]*)\s*(,|})/g, ': "$1"$2');

  return step2;
}

function removeSome(texto) {
  texto = texto.trim();

  if (texto.startsWith('Some(') && texto.endsWith(')')) {
    const interno = texto.slice(5, -1);
    return removeSome(interno);
  }

  // Se não começa com Some(, mas ainda tem Some( dentro, vamos tratar partes internas
  let resultado = '';
  let i = 0;
  while (i < texto.length) {
    if (texto.slice(i, i + 5) === 'Some(') {
      i += 5;
      let open = 1;
      let start = i;
      while (i < texto.length && open > 0) {
        if (texto[i] === '(') open++;
        else if (texto[i] === ')') open--;
        i++;
      }
      const conteudoSome = texto.slice(start, i - 1);
      resultado += removeSome(conteudoSome);
    } else {
      resultado += texto[i];
      i++;
    }
  }

  return resultado;
}

function removeStructNames(texto) {
  return texto.replace(/([a-zA-Z0-9_]+)\s*\{/g, '{');
}
