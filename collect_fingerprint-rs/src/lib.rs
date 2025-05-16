use wasm_bindgen::prelude::*;
use fingerprint_rs::FingerPrint;

#[wasm_bindgen]
pub async fn get_fingerprint() -> Result<String, JsValue> {
    match FingerPrint::new().await {
        Some(fp) => {
            // Formata diretamente a string
            let fp_string = format!("{:?}", fp);

            // Retorna a string formatada
            Ok(fp_string)
        }
        None => Err(JsValue::from_str("Não foi possível gerar o fingerprint")),
    }
}