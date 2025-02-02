import { TextEncoder, TextDecoder } from 'util';
import { jest } from '@jest/globals';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
