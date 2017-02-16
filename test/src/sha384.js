import test from 'ava' ;
import * as hash from '../../src' ;
import array from "@aureooms/js-array" ;
import functools from "@aureooms/js-functools" ;
import { list , map , product } from "@aureooms/js-itertools" ;

const ascii = s => list( map( c => c.charCodeAt( 0 ) , s ) ) ;

function macro ( t , [ [sha384name, sha384], [string, expected] ] ) {

	const digest = sha384( ascii( string ), string.length * 8, array.alloc( 48 ) );

	t.deepEqual( digest, expected, `${sha384name} ${string}`);

}

macro.title = ( provided , [ [ sha384name, sha384 ], [string, expected] ] ) => `${provided} ${sha384name} ${string}` ;

const inputs = product( [

	[
		[ "sha384", hash.sha384 ]
	],

	[

		[
			"The quick brown fox jumps over the lazy dog",
			[0xca, 0x73, 0x7f, 0x10, 0x14, 0xa4, 0x8f, 0x4c, 0x0b, 0x6d, 0xd4, 0x3c, 0xb1, 0x77, 0xb0, 0xaf, 0xd9, 0xe5, 0x16, 0x93, 0x67, 0x54, 0x4c, 0x49, 0x40, 0x11, 0xe3, 0x31, 0x7d, 0xbf, 0x9a, 0x50, 0x9c, 0xb1, 0xe5, 0xdc, 0x1e, 0x85, 0xa9, 0x41, 0xbb, 0xee, 0x3d, 0x7f, 0x2a, 0xfb, 0xc9, 0xb1]
		],
		[
			"The quick brown fox jumps over the lazy dog.",
			[0xed, 0x89, 0x24, 0x81, 0xd8, 0x27, 0x2c, 0xa6, 0xdf, 0x37, 0x0b, 0xf7, 0x06, 0xe4, 0xd7, 0xbc, 0x1b, 0x57, 0x39, 0xfa, 0x21, 0x77, 0xaa, 0xe6, 0xc5, 0x0e, 0x94, 0x66, 0x78, 0x71, 0x8f, 0xc6, 0x7a, 0x7a, 0xf2, 0x81, 0x9a, 0x02, 0x1c, 0x2f, 0xc3, 0x4e, 0x91, 0xbd, 0xb6, 0x34, 0x09, 0xd7]
		],
		[
			"",
			[0x38, 0xb0, 0x60, 0xa7, 0x51, 0xac, 0x96, 0x38, 0x4c, 0xd9, 0x32, 0x7e, 0xb1, 0xb1, 0xe3, 0x6a, 0x21, 0xfd, 0xb7, 0x11, 0x14, 0xbe, 0x07, 0x43, 0x4c, 0x0c, 0xc7, 0xbf, 0x63, 0xf6, 0xe1, 0xda, 0x27, 0x4e, 0xde, 0xbf, 0xe7, 0x6f, 0x65, 0xfb, 0xd5, 0x1a, 0xd2, 0xf1, 0x48, 0x98, 0xb9, 0x5b]
		],
		[
			"abc",
			[0xcb, 0x00, 0x75, 0x3f, 0x45, 0xa3, 0x5e, 0x8b, 0xb5, 0xa0, 0x3d, 0x69, 0x9a, 0xc6, 0x50, 0x07, 0x27, 0x2c, 0x32, 0xab, 0x0e, 0xde, 0xd1, 0x63, 0x1a, 0x8b, 0x60, 0x5a, 0x43, 0xff, 0x5b, 0xed, 0x80, 0x86, 0x07, 0x2b, 0xa1, 0xe7, 0xcc, 0x23, 0x58, 0xba, 0xec, 0xa1, 0x34, 0xc8, 0x25, 0xa7]
		],
		[
			"abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu",
			[0x09, 0x33, 0x0c, 0x33, 0xf7, 0x11, 0x47, 0xe8, 0x3d, 0x19, 0x2f, 0xc7, 0x82, 0xcd, 0x1b, 0x47, 0x53, 0x11, 0x1b, 0x17, 0x3b, 0x3b, 0x05, 0xd2, 0x2f, 0xa0, 0x80, 0x86, 0xe3, 0xb0, 0xf7, 0x12, 0xfc, 0xc7, 0xc7, 0x1a, 0x55, 0x7e, 0x2d, 0xb9, 0x66, 0xc3, 0xe9, 0xfa, 0x91, 0x74, 0x60, 0x39]
		],
		[
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
			[0xd3, 0xb5, 0x71, 0x0e, 0x17, 0xda, 0x84, 0x21, 0x6f, 0x1b, 0xf0, 0x80, 0x79, 0xbb, 0xbb, 0xf4, 0x53, 0x03, 0xba, 0xef, 0xc6, 0xec, 0xd6, 0x77, 0x91, 0x0a, 0x1c, 0x33, 0xc8, 0x6c, 0xb1, 0x64, 0x28, 0x1f, 0x0f, 0x2d, 0xca, 0xb5, 0x5b, 0xba, 0xdc, 0x5e, 0x86, 0x06, 0xbd, 0xbc, 0x16, 0xb6]
		]

	]

] , 1 ) ;

for ( const x of inputs ) test( 'sha384' , macro , x ) ;
