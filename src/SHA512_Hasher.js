import { sha512_initial_state , sha512_call } from './sha512' ;

import { copy } from '@aureooms/js-array' ;
import { NotImplementedError } from '@aureooms/js-error' ;

export class SHA512_Hasher {

	constructor ( ) {

		this.state = sha512_initial_state() ;
		this.total_bits = 0 ;
		this.buffer = new ArrayBuffer(128) ;
		this.buffer_bits = 0 ;

	}

	update ( bytes , offset = 0 , length = bytes.length - offset ) {

		if ( this.buffer_bits & 0xFFF !== 0 ) {
			throw NotImplementedError('Cannot add bytes to bits (for now).') ;
		}

		this.total_bits += length << 3 ;

		const buffer_bytes = this.buffer_bits >> 3 ;

		if ( buffer_bytes > 0 ) {

			const buffer_complement = 128 - buffer_bytes ;

			if ( length < buffer_complement ) {
				// buffer is not full
				copy( bytes , offset , offset + length , this.buffer , buffer_bytes ) ;
				this.buffer_bits += length << 3 ;
				return ;
			}

			else {
				// pad buffer with head of bytes and process it
				copy( bytes , offset , offset + buffer_complement , this.buffer , buffer_bytes ) ;
				sha512_call(this.state, this.buffer, 0);
				this.buffer_bits = 0 ;
				offset += buffer_complement ;
				length -= buffer_complement ;
			}

		}

		const full_blocks = length >> 7 ;

		for ( let i = 0 ; i < full_blocks ; ++i ) {
			sha512_call(this.state, bytes, offset);
			offset += 128 ;
			length -= 128 ;
		}

		copy( bytes , offset , offset + length , this.buffer , 0 ) ;
		this.buffer_bits = length << 3 ;

	}

	digest ( ) {
		const digest = new ArrayBuffer(128);
		return sha512_finalize(this.buffer, this.total_bits, digest, this.buffer_bits >> 3, 0, this.buffer_bits, this.state);
	}

}
