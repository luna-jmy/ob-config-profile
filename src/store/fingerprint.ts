/**
 * 内容指纹（纯函数，非加密用途）：FNV-1a 32 位，用于 _meta.json 里「指纹未变跳过写入」。
 */

export function fingerprint(text: string): string {
	let hash = 0x811c9dc5;
	for (let i = 0; i < text.length; i++) {
		hash ^= text.charCodeAt(i);
		hash = Math.imul(hash, 0x01000193);
	}
	return (hash >>> 0).toString(16).padStart(8, "0");
}
