import test from 'ava' ;
import * as hash from '../../src' ;
import array from "@aureooms/js-array" ;
import functools from "@aureooms/js-functools" ;
import { list , map , product } from "@aureooms/js-itertools" ;

const ascii = s => list( map( c => c.charCodeAt( 0 ) , s ) ) ;

function macro ( t , [ [sha512name, sha512], [string, expected] ] ) {

	const digest = sha512( ascii( string ), string.length * 8, array.alloc( 64 ) );

	t.deepEqual( digest, expected, `${sha512name} ${string}`);

}

macro.title = ( provided , [ [ sha512name, sha512 ], [string, expected] ] ) => `${provided} ${sha512name} ${string}` ;

const inputs = product( [

	[
		[ "sha512", hash.sha512 ]
	],

	[

		[
			"The quick brown fox jumps over the lazy dog",
			[0x07, 0xe5, 0x47, 0xd9, 0x58, 0x6f, 0x6a, 0x73, 0xf7, 0x3f, 0xba, 0xc0, 0x43, 0x5e, 0xd7, 0x69, 0x51, 0x21, 0x8f, 0xb7, 0xd0, 0xc8, 0xd7, 0x88, 0xa3, 0x09, 0xd7, 0x85, 0x43, 0x6b, 0xbb, 0x64, 0x2e, 0x93, 0xa2, 0x52, 0xa9, 0x54, 0xf2, 0x39, 0x12, 0x54, 0x7d, 0x1e, 0x8a, 0x3b, 0x5e, 0xd6, 0xe1, 0xbf, 0xd7, 0x09, 0x78, 0x21, 0x23, 0x3f, 0xa0, 0x53, 0x8f, 0x3d, 0xb8, 0x54, 0xfe, 0xe6]
		],
		[
			"The quick brown fox jumps over the lazy dog.",
			[0x91, 0xea, 0x12, 0x45, 0xf2, 0x0d, 0x46, 0xae, 0x9a, 0x03, 0x7a, 0x98, 0x9f, 0x54, 0xf1, 0xf7, 0x90, 0xf0, 0xa4, 0x76, 0x07, 0xee, 0xb8, 0xa1, 0x4d, 0x12, 0x89, 0x0c, 0xea, 0x77, 0xa1, 0xbb, 0xc6, 0xc7, 0xed, 0x9c, 0xf2, 0x05, 0xe6, 0x7b, 0x7f, 0x2b, 0x8f, 0xd4, 0xc7, 0xdf, 0xd3, 0xa7, 0xa8, 0x61, 0x7e, 0x45, 0xf3, 0xc4, 0x63, 0xd4, 0x81, 0xc7, 0xe5, 0x86, 0xc3, 0x9a, 0xc1, 0xed]
		],
		[
			"",
			[0xcf, 0x83, 0xe1, 0x35, 0x7e, 0xef, 0xb8, 0xbd, 0xf1, 0x54, 0x28, 0x50, 0xd6, 0x6d, 0x80, 0x07, 0xd6, 0x20, 0xe4, 0x05, 0x0b, 0x57, 0x15, 0xdc, 0x83, 0xf4, 0xa9, 0x21, 0xd3, 0x6c, 0xe9, 0xce, 0x47, 0xd0, 0xd1, 0x3c, 0x5d, 0x85, 0xf2, 0xb0, 0xff, 0x83, 0x18, 0xd2, 0x87, 0x7e, 0xec, 0x2f, 0x63, 0xb9, 0x31, 0xbd, 0x47, 0x41, 0x7a, 0x81, 0xa5, 0x38, 0x32, 0x7a, 0xf9, 0x27, 0xda, 0x3e]
		],
		[
			"abc",
			[0xdd, 0xaf, 0x35, 0xa1, 0x93, 0x61, 0x7a, 0xba, 0xcc, 0x41, 0x73, 0x49, 0xae, 0x20, 0x41, 0x31, 0x12, 0xe6, 0xfa, 0x4e, 0x89, 0xa9, 0x7e, 0xa2, 0x0a, 0x9e, 0xee, 0xe6, 0x4b, 0x55, 0xd3, 0x9a, 0x21, 0x92, 0x99, 0x2a, 0x27, 0x4f, 0xc1, 0xa8, 0x36, 0xba, 0x3c, 0x23, 0xa3, 0xfe, 0xeb, 0xbd, 0x45, 0x4d, 0x44, 0x23, 0x64, 0x3c, 0xe8, 0x0e, 0x2a, 0x9a, 0xc9, 0x4f, 0xa5, 0x4c, 0xa4, 0x9f]
		],
		[
			"abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu",
			[0x8e, 0x95, 0x9b, 0x75, 0xda, 0xe3, 0x13, 0xda, 0x8c, 0xf4, 0xf7, 0x28, 0x14, 0xfc, 0x14, 0x3f, 0x8f, 0x77, 0x79, 0xc6, 0xeb, 0x9f, 0x7f, 0xa1, 0x72, 0x99, 0xae, 0xad, 0xb6, 0x88, 0x90, 0x18, 0x50, 0x1d, 0x28, 0x9e, 0x49, 0x00, 0xf7, 0xe4, 0x33, 0x1b, 0x99, 0xde, 0xc4, 0xb5, 0x43, 0x3a, 0xc7, 0xd3, 0x29, 0xee, 0xb6, 0xdd, 0x26, 0x54, 0x5e, 0x96, 0xe5, 0x5b, 0x87, 0x4b, 0xe9, 0x09]
		],
		[
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			[0x8b, 0xa7, 0x60, 0xca, 0xc2, 0x9c, 0xb2, 0xb2, 0xce, 0x66, 0x85, 0x8e, 0xad, 0x16, 0x91, 0x74, 0x05, 0x7a, 0xa1, 0x29, 0x8c, 0xcd, 0x58, 0x15, 0x14, 0xe6, 0xdb, 0x6d, 0xee, 0x32, 0x85, 0x28, 0x0e, 0xe6, 0xe3, 0xa5, 0x4c, 0x93, 0x19, 0x07, 0x1d, 0xc8, 0x16, 0x5f, 0xf0, 0x61, 0xd7, 0x77, 0x83, 0x10, 0x0d, 0x44, 0x9c, 0x93, 0x7f, 0xf1, 0xfb, 0x4c, 0xd1, 0xbb, 0x51, 0x6a, 0x69, 0xb9]
		],
		[
			"abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstuv",
			[0x3b, 0xac, 0x30, 0xb4, 0xb4, 0x93, 0x3a, 0xb8, 0xa5, 0x35, 0xcb, 0x7b, 0x24, 0x07, 0x88, 0xa3, 0x41, 0x77, 0xac, 0x2f, 0x7b, 0x76, 0xd8, 0xd0, 0xc8, 0xfc, 0x15, 0x4e, 0xf9, 0xf4, 0x8d, 0x5d, 0x5b, 0xf8, 0x80, 0xf3, 0x2c, 0x9c, 0xe5, 0x25, 0x59, 0x9d, 0x49, 0x6c, 0x6d, 0xaa, 0x77, 0xc3, 0xe3, 0x2f, 0x50, 0x72, 0xa9, 0xe4, 0x1b, 0x68, 0x4e, 0x8d, 0xdd, 0xfb, 0x3d, 0x81, 0x6d, 0x8d]
		]

	]

] , 1 ) ;

for ( const x of inputs ) test( 'sha512' , macro , x ) ;
