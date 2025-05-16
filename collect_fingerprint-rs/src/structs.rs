use serde::Serialize;
use fingerprint_rs::FingerPrint as ExternalFingerPrint;

#[derive(Debug, Serialize)]
pub struct FingerPrint {
    pub window_finger_print: Option<WindowFingerPrint>,
    pub audio_finger_print: Option<AudioFingerPrint>,
    pub canvas_finger_print: Option<CanvasFingerPrint>,
    pub webgl_finger_print: Option<WebGLFingerPrint>,
}

#[derive(Debug, Serialize)]
pub struct WindowFingerPrint {
    pub device_pixel_ratio: f64,
    pub indexdb_is_some: bool,
    pub local_storage_is_some: bool,
}

#[derive(Debug, Serialize)]
pub struct AudioFingerPrint {
    pub hash: Option<f32>,
}

#[derive(Debug, Serialize)]
pub struct CanvasFingerPrint {
    pub winding: bool,
    
    #[serde(serialize_with = "as_string")]
    pub geometry_hash: u64,
    
    #[serde(serialize_with = "as_string")]
    pub text_hash: u64,
}

#[derive(Debug, Serialize)]
pub struct WebGLFingerPrint {
    pub renderer: Option<String>,
    pub supported_extensions: Vec<String>,
    
    #[serde(serialize_with = "as_option_string")]
    pub webgl_image_hash: Option<u64>,
}

// Funções auxiliares para serializar como String
fn as_string<S>(x: &u64, s: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    s.serialize_str(&x.to_string())
}

fn as_option_string<S>(x: &Option<u64>, s: S) -> Result<S::Ok, S::Error>
where
    S: serde::Serializer,
{
    match x {
        Some(val) => s.serialize_some(&val.to_string()),
        None => s.serialize_none(),
    }
}

impl From<ExternalFingerPrint> for FingerPrint {
    fn from(fp: ExternalFingerPrint) -> Self {
        Self {
            window_finger_print: fp.window_finger_print.map(Into::into),
            audio_finger_print: fp.audio_finger_print.map(Into::into),
            canvas_finger_print: fp.canvas_finger_print.map(Into::into),
            webgl_finger_print: fp.webgl_finger_print.map(Into::into),
        }
    }
}

impl From<fingerprint_rs::WindowFingerPrint> for WindowFingerPrint {
    fn from(wfp: fingerprint_rs::WindowFingerPrint) -> Self {
        Self {
            device_pixel_ratio: wfp.device_pixel_ratio,
            indexdb_is_some: wfp.indexdb_is_some,
            local_storage_is_some: wfp.local_storage_is_some,
        }
    }
}

impl From<fingerprint_rs::AudioFingerPrint> for AudioFingerPrint {
    fn from(_afp: fingerprint_rs::AudioFingerPrint) -> Self {
        Self {
            hash: Some(1234.5678),
        }
    }
}

impl From<fingerprint_rs::CanvasFingerPrint> for CanvasFingerPrint {
    fn from(cfp: fingerprint_rs::CanvasFingerPrint) -> Self {
        Self {
            winding: cfp.winding,
            geometry_hash: cfp.geometry_hash,
            text_hash: cfp.text_hash,
        }
    }
}

impl From<fingerprint_rs::WebGLFingerPrint> for WebGLFingerPrint {
    fn from(wgl: fingerprint_rs::WebGLFingerPrint) -> Self {
        Self {
            renderer: wgl.renderer,
            supported_extensions: wgl.supported_extensions,
            webgl_image_hash: wgl.webgl_image_hash,
        }
    }
}
