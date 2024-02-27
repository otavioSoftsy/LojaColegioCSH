var PagSeguro = (function (exports) {
  "use strict";

  var commonjsGlobal =
    typeof globalThis !== "undefined"
      ? globalThis
      : typeof window !== "undefined"
      ? window
      : typeof global !== "undefined"
      ? global
      : typeof self !== "undefined"
      ? self
      : {};

  function unwrapExports(x) {
    return x &&
      x.__esModule &&
      Object.prototype.hasOwnProperty.call(x, "default")
      ? x["default"]
      : x;
  }

  function createCommonjsModule(fn, module) {
    return (
      (module = { exports: {} }), fn(module, module.exports), module.exports
    );
  }

  var jsencrypt = createCommonjsModule(function (module, exports) {
    (function (global, factory) {
      factory(exports);
    })(commonjsGlobal, function (exports) {
      var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz";
      function int2char(n) {
        return BI_RM.charAt(n);
      }
      //#region BIT_OPERATIONS
      // (public) this & a
      function op_and(x, y) {
        return x & y;
      }
      // (public) this | a
      function op_or(x, y) {
        return x | y;
      }
      // (public) this ^ a
      function op_xor(x, y) {
        return x ^ y;
      }
      // (public) this & ~a
      function op_andnot(x, y) {
        return x & ~y;
      }
      // return index of lowest 1-bit in x, x < 2^31
      function lbit(x) {
        if (x == 0) {
          return -1;
        }
        var r = 0;
        if ((x & 0xffff) == 0) {
          x >>= 16;
          r += 16;
        }
        if ((x & 0xff) == 0) {
          x >>= 8;
          r += 8;
        }
        if ((x & 0xf) == 0) {
          x >>= 4;
          r += 4;
        }
        if ((x & 3) == 0) {
          x >>= 2;
          r += 2;
        }
        if ((x & 1) == 0) {
          ++r;
        }
        return r;
      }
      // return number of 1 bits in x
      function cbit(x) {
        var r = 0;
        while (x != 0) {
          x &= x - 1;
          ++r;
        }
        return r;
      }
      //#endregion BIT_OPERATIONS

      var b64map =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      var b64pad = "=";
      function hex2b64(h) {
        var i;
        var c;
        var ret = "";
        for (i = 0; i + 3 <= h.length; i += 3) {
          c = parseInt(h.substring(i, i + 3), 16);
          ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
        }
        if (i + 1 == h.length) {
          c = parseInt(h.substring(i, i + 1), 16);
          ret += b64map.charAt(c << 2);
        } else if (i + 2 == h.length) {
          c = parseInt(h.substring(i, i + 2), 16);
          ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
        }
        while ((ret.length & 3) > 0) {
          ret += b64pad;
        }
        return ret;
      }
      // convert a base64 string to hex
      function b64tohex(s) {
        var ret = "";
        var i;
        var k = 0; // b64 state, 0-3
        var slop = 0;
        for (i = 0; i < s.length; ++i) {
          if (s.charAt(i) == b64pad) {
            break;
          }
          var v = b64map.indexOf(s.charAt(i));
          if (v < 0) {
            continue;
          }
          if (k == 0) {
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 1;
          } else if (k == 1) {
            ret += int2char((slop << 2) | (v >> 4));
            slop = v & 0xf;
            k = 2;
          } else if (k == 2) {
            ret += int2char(slop);
            ret += int2char(v >> 2);
            slop = v & 3;
            k = 3;
          } else {
            ret += int2char((slop << 2) | (v >> 4));
            ret += int2char(v & 0xf);
            k = 0;
          }
        }
        if (k == 1) {
          ret += int2char(slop << 2);
        }
        return ret;
      }

      /*! *****************************************************************************
	Copyright (c) Microsoft Corporation. All rights reserved.
	Licensed under the Apache License, Version 2.0 (the "License"); you may not use
	this file except in compliance with the License. You may obtain a copy of the
	License at http://www.apache.org/licenses/LICENSE-2.0

	THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
	KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
	WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
	MERCHANTABLITY OR NON-INFRINGEMENT.

	See the Apache Version 2.0 License for specific language governing permissions
	and limitations under the License.
	***************************************************************************** */
      /* global Reflect, Promise */

      var extendStatics = function (d, b) {
        extendStatics =
          Object.setPrototypeOf ||
          ({ __proto__: [] } instanceof Array &&
            function (d, b) {
              d.__proto__ = b;
            }) ||
          function (d, b) {
            for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
          };
        return extendStatics(d, b);
      };

      function __extends(d, b) {
        extendStatics(d, b);
        function __() {
          this.constructor = d;
        }
        d.prototype =
          b === null
            ? Object.create(b)
            : ((__.prototype = b.prototype), new __());
      }

      // Hex JavaScript decoder
      // Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
      // Permission to use, copy, modify, and/or distribute this software for any
      // purpose with or without fee is hereby granted, provided that the above
      // copyright notice and this permission notice appear in all copies.
      //
      // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
      // WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
      // MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
      // ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
      // WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
      // ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
      // OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
      /*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
      var decoder;
      var Hex = {
        decode: function (a) {
          var i;
          if (decoder === undefined) {
            var hex = "0123456789ABCDEF";
            var ignore = " \f\n\r\t\u00A0\u2028\u2029";
            decoder = {};
            for (i = 0; i < 16; ++i) {
              decoder[hex.charAt(i)] = i;
            }
            hex = hex.toLowerCase();
            for (i = 10; i < 16; ++i) {
              decoder[hex.charAt(i)] = i;
            }
            for (i = 0; i < ignore.length; ++i) {
              decoder[ignore.charAt(i)] = -1;
            }
          }
          var out = [];
          var bits = 0;
          var char_count = 0;
          for (i = 0; i < a.length; ++i) {
            var c = a.charAt(i);
            if (c == "=") {
              break;
            }
            c = decoder[c];
            if (c == -1) {
              continue;
            }
            if (c === undefined) {
              throw new Error("Illegal character at offset " + i);
            }
            bits |= c;
            if (++char_count >= 2) {
              out[out.length] = bits;
              bits = 0;
              char_count = 0;
            } else {
              bits <<= 4;
            }
          }
          if (char_count) {
            throw new Error("Hex encoding incomplete: 4 bits missing");
          }
          return out;
        },
      };

      // Base64 JavaScript decoder
      // Copyright (c) 2008-2013 Lapo Luchini <lapo@lapo.it>
      // Permission to use, copy, modify, and/or distribute this software for any
      // purpose with or without fee is hereby granted, provided that the above
      // copyright notice and this permission notice appear in all copies.
      //
      // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
      // WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
      // MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
      // ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
      // WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
      // ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
      // OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
      /*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
      var decoder$1;
      var Base64 = {
        decode: function (a) {
          var i;
          if (decoder$1 === undefined) {
            var b64 =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            var ignore = "= \f\n\r\t\u00A0\u2028\u2029";
            decoder$1 = Object.create(null);
            for (i = 0; i < 64; ++i) {
              decoder$1[b64.charAt(i)] = i;
            }
            for (i = 0; i < ignore.length; ++i) {
              decoder$1[ignore.charAt(i)] = -1;
            }
          }
          var out = [];
          var bits = 0;
          var char_count = 0;
          for (i = 0; i < a.length; ++i) {
            var c = a.charAt(i);
            if (c == "=") {
              break;
            }
            c = decoder$1[c];
            if (c == -1) {
              continue;
            }
            if (c === undefined) {
              throw new Error("Illegal character at offset " + i);
            }
            bits |= c;
            if (++char_count >= 4) {
              out[out.length] = bits >> 16;
              out[out.length] = (bits >> 8) & 0xff;
              out[out.length] = bits & 0xff;
              bits = 0;
              char_count = 0;
            } else {
              bits <<= 6;
            }
          }
          switch (char_count) {
            case 1:
              throw new Error(
                "Base64 encoding incomplete: at least 2 bits missing"
              );
            case 2:
              out[out.length] = bits >> 10;
              break;
            case 3:
              out[out.length] = bits >> 16;
              out[out.length] = (bits >> 8) & 0xff;
              break;
          }
          return out;
        },
        re: /-----BEGIN [^-]+-----([A-Za-z0-9+\/=\s]+)-----END [^-]+-----|begin-base64[^\n]+\n([A-Za-z0-9+\/=\s]+)====/,
        unarmor: function (a) {
          var m = Base64.re.exec(a);
          if (m) {
            if (m[1]) {
              a = m[1];
            } else if (m[2]) {
              a = m[2];
            } else {
              throw new Error("RegExp out of sync");
            }
          }
          return Base64.decode(a);
        },
      };

      // Big integer base-10 printing library
      // Copyright (c) 2014 Lapo Luchini <lapo@lapo.it>
      // Permission to use, copy, modify, and/or distribute this software for any
      // purpose with or without fee is hereby granted, provided that the above
      // copyright notice and this permission notice appear in all copies.
      //
      // THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
      // WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
      // MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
      // ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
      // WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
      // ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
      // OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
      /*jshint browser: true, strict: true, immed: true, latedef: true, undef: true, regexdash: false */
      var max = 10000000000000; // biggest integer that can still fit 2^53 when multiplied by 256
      var Int10 = /** @class */ (function () {
        function Int10(value) {
          this.buf = [+value || 0];
        }
        Int10.prototype.mulAdd = function (m, c) {
          // assert(m <= 256)
          var b = this.buf;
          var l = b.length;
          var i;
          var t;
          for (i = 0; i < l; ++i) {
            t = b[i] * m + c;
            if (t < max) {
              c = 0;
            } else {
              c = 0 | (t / max);
              t -= c * max;
            }
            b[i] = t;
          }
          if (c > 0) {
            b[i] = c;
          }
        };
        Int10.prototype.sub = function (c) {
          // assert(m <= 256)
          var b = this.buf;
          var l = b.length;
          var i;
          var t;
          for (i = 0; i < l; ++i) {
            t = b[i] - c;
            if (t < 0) {
              t += max;
              c = 1;
            } else {
              c = 0;
            }
            b[i] = t;
          }
          while (b[b.length - 1] === 0) {
            b.pop();
          }
        };
        Int10.prototype.toString = function (base) {
          if ((base || 10) != 10) {
            throw new Error("only base 10 is supported");
          }
          var b = this.buf;
          var s = b[b.length - 1].toString();
          for (var i = b.length - 2; i >= 0; --i) {
            s += (max + b[i]).toString().substring(1);
          }
          return s;
        };
        Int10.prototype.valueOf = function () {
          var b = this.buf;
          var v = 0;
          for (var i = b.length - 1; i >= 0; --i) {
            v = v * max + b[i];
          }
          return v;
        };
        Int10.prototype.simplify = function () {
          var b = this.buf;
          return b.length == 1 ? b[0] : this;
        };
        return Int10;
      })();

      // ASN.1 JavaScript decoder
      var ellipsis = "\u2026";
      var reTimeS =
        /^(\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
      var reTimeL =
        /^(\d\d\d\d)(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])([01]\d|2[0-3])(?:([0-5]\d)(?:([0-5]\d)(?:[.,](\d{1,3}))?)?)?(Z|[-+](?:[0]\d|1[0-2])([0-5]\d)?)?$/;
      function stringCut(str, len) {
        if (str.length > len) {
          str = str.substring(0, len) + ellipsis;
        }
        return str;
      }
      var Stream = /** @class */ (function () {
        function Stream(enc, pos) {
          this.hexDigits = "0123456789ABCDEF";
          if (enc instanceof Stream) {
            this.enc = enc.enc;
            this.pos = enc.pos;
          } else {
            // enc should be an array or a binary string
            this.enc = enc;
            this.pos = pos;
          }
        }
        Stream.prototype.get = function (pos) {
          if (pos === undefined) {
            pos = this.pos++;
          }
          if (pos >= this.enc.length) {
            throw new Error(
              "Requesting byte offset " +
                pos +
                " on a stream of length " +
                this.enc.length
            );
          }
          return "string" === typeof this.enc
            ? this.enc.charCodeAt(pos)
            : this.enc[pos];
        };
        Stream.prototype.hexByte = function (b) {
          return (
            this.hexDigits.charAt((b >> 4) & 0xf) +
            this.hexDigits.charAt(b & 0xf)
          );
        };
        Stream.prototype.hexDump = function (start, end, raw) {
          var s = "";
          for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
            if (raw !== true) {
              switch (i & 0xf) {
                case 0x7:
                  s += "  ";
                  break;
                case 0xf:
                  s += "\n";
                  break;
                default:
                  s += " ";
              }
            }
          }
          return s;
        };
        Stream.prototype.isASCII = function (start, end) {
          for (var i = start; i < end; ++i) {
            var c = this.get(i);
            if (c < 32 || c > 176) {
              return false;
            }
          }
          return true;
        };
        Stream.prototype.parseStringISO = function (start, end) {
          var s = "";
          for (var i = start; i < end; ++i) {
            s += String.fromCharCode(this.get(i));
          }
          return s;
        };
        Stream.prototype.parseStringUTF = function (start, end) {
          var s = "";
          for (var i = start; i < end; ) {
            var c = this.get(i++);
            if (c < 128) {
              s += String.fromCharCode(c);
            } else if (c > 191 && c < 224) {
              s += String.fromCharCode(
                ((c & 0x1f) << 6) | (this.get(i++) & 0x3f)
              );
            } else {
              s += String.fromCharCode(
                ((c & 0x0f) << 12) |
                  ((this.get(i++) & 0x3f) << 6) |
                  (this.get(i++) & 0x3f)
              );
            }
          }
          return s;
        };
        Stream.prototype.parseStringBMP = function (start, end) {
          var str = "";
          var hi;
          var lo;
          for (var i = start; i < end; ) {
            hi = this.get(i++);
            lo = this.get(i++);
            str += String.fromCharCode((hi << 8) | lo);
          }
          return str;
        };
        Stream.prototype.parseTime = function (start, end, shortYear) {
          var s = this.parseStringISO(start, end);
          var m = (shortYear ? reTimeS : reTimeL).exec(s);
          if (!m) {
            return "Unrecognized time: " + s;
          }
          if (shortYear) {
            // to avoid querying the timer, use the fixed range [1970, 2069]
            // it will conform with ITU X.400 [-10, +40] sliding window until 2030
            m[1] = +m[1];
            m[1] += +m[1] < 70 ? 2000 : 1900;
          }
          s = m[1] + "-" + m[2] + "-" + m[3] + " " + m[4];
          if (m[5]) {
            s += ":" + m[5];
            if (m[6]) {
              s += ":" + m[6];
              if (m[7]) {
                s += "." + m[7];
              }
            }
          }
          if (m[8]) {
            s += " UTC";
            if (m[8] != "Z") {
              s += m[8];
              if (m[9]) {
                s += ":" + m[9];
              }
            }
          }
          return s;
        };
        Stream.prototype.parseInteger = function (start, end) {
          var v = this.get(start);
          var neg = v > 127;
          var pad = neg ? 255 : 0;
          var len;
          var s = "";
          // skip unuseful bits (not allowed in DER)
          while (v == pad && ++start < end) {
            v = this.get(start);
          }
          len = end - start;
          if (len === 0) {
            return neg ? -1 : 0;
          }
          // show bit length of huge integers
          if (len > 4) {
            s = v;
            len <<= 3;
            while (((+s ^ pad) & 0x80) == 0) {
              s = +s << 1;
              --len;
            }
            s = "(" + len + " bit)\n";
          }
          // decode the integer
          if (neg) {
            v = v - 256;
          }
          var n = new Int10(v);
          for (var i = start + 1; i < end; ++i) {
            n.mulAdd(256, this.get(i));
          }
          return s + n.toString();
        };
        Stream.prototype.parseBitString = function (start, end, maxLength) {
          var unusedBit = this.get(start);
          var lenBit = ((end - start - 1) << 3) - unusedBit;
          var intro = "(" + lenBit + " bit)\n";
          var s = "";
          for (var i = start + 1; i < end; ++i) {
            var b = this.get(i);
            var skip = i == end - 1 ? unusedBit : 0;
            for (var j = 7; j >= skip; --j) {
              s += (b >> j) & 1 ? "1" : "0";
            }
            if (s.length > maxLength) {
              return intro + stringCut(s, maxLength);
            }
          }
          return intro + s;
        };
        Stream.prototype.parseOctetString = function (start, end, maxLength) {
          if (this.isASCII(start, end)) {
            return stringCut(this.parseStringISO(start, end), maxLength);
          }
          var len = end - start;
          var s = "(" + len + " byte)\n";
          maxLength /= 2; // we work in bytes
          if (len > maxLength) {
            end = start + maxLength;
          }
          for (var i = start; i < end; ++i) {
            s += this.hexByte(this.get(i));
          }
          if (len > maxLength) {
            s += ellipsis;
          }
          return s;
        };
        Stream.prototype.parseOID = function (start, end, maxLength) {
          var s = "";
          var n = new Int10();
          var bits = 0;
          for (var i = start; i < end; ++i) {
            var v = this.get(i);
            n.mulAdd(128, v & 0x7f);
            bits += 7;
            if (!(v & 0x80)) {
              // finished
              if (s === "") {
                n = n.simplify();
                if (n instanceof Int10) {
                  n.sub(80);
                  s = "2." + n.toString();
                } else {
                  var m = n < 80 ? (n < 40 ? 0 : 1) : 2;
                  s = m + "." + (n - m * 40);
                }
              } else {
                s += "." + n.toString();
              }
              if (s.length > maxLength) {
                return stringCut(s, maxLength);
              }
              n = new Int10();
              bits = 0;
            }
          }
          if (bits > 0) {
            s += ".incomplete";
          }
          return s;
        };
        return Stream;
      })();
      var ASN1 = /** @class */ (function () {
        function ASN1(stream, header, length, tag, sub) {
          if (!(tag instanceof ASN1Tag)) {
            throw new Error("Invalid tag value.");
          }
          this.stream = stream;
          this.header = header;
          this.length = length;
          this.tag = tag;
          this.sub = sub;
        }
        ASN1.prototype.typeName = function () {
          switch (this.tag.tagClass) {
            case 0: // universal
              switch (this.tag.tagNumber) {
                case 0x00:
                  return "EOC";
                case 0x01:
                  return "BOOLEAN";
                case 0x02:
                  return "INTEGER";
                case 0x03:
                  return "BIT_STRING";
                case 0x04:
                  return "OCTET_STRING";
                case 0x05:
                  return "NULL";
                case 0x06:
                  return "OBJECT_IDENTIFIER";
                case 0x07:
                  return "ObjectDescriptor";
                case 0x08:
                  return "EXTERNAL";
                case 0x09:
                  return "REAL";
                case 0x0a:
                  return "ENUMERATED";
                case 0x0b:
                  return "EMBEDDED_PDV";
                case 0x0c:
                  return "UTF8String";
                case 0x10:
                  return "SEQUENCE";
                case 0x11:
                  return "SET";
                case 0x12:
                  return "NumericString";
                case 0x13:
                  return "PrintableString"; // ASCII subset
                case 0x14:
                  return "TeletexString"; // aka T61String
                case 0x15:
                  return "VideotexString";
                case 0x16:
                  return "IA5String"; // ASCII
                case 0x17:
                  return "UTCTime";
                case 0x18:
                  return "GeneralizedTime";
                case 0x19:
                  return "GraphicString";
                case 0x1a:
                  return "VisibleString"; // ASCII subset
                case 0x1b:
                  return "GeneralString";
                case 0x1c:
                  return "UniversalString";
                case 0x1e:
                  return "BMPString";
              }
              return "Universal_" + this.tag.tagNumber.toString();
            case 1:
              return "Application_" + this.tag.tagNumber.toString();
            case 2:
              return "[" + this.tag.tagNumber.toString() + "]"; // Context
            case 3:
              return "Private_" + this.tag.tagNumber.toString();
          }
        };
        ASN1.prototype.content = function (maxLength) {
          if (this.tag === undefined) {
            return null;
          }
          if (maxLength === undefined) {
            maxLength = Infinity;
          }
          var content = this.posContent();
          var len = Math.abs(this.length);
          if (!this.tag.isUniversal()) {
            if (this.sub !== null) {
              return "(" + this.sub.length + " elem)";
            }
            return this.stream.parseOctetString(
              content,
              content + len,
              maxLength
            );
          }
          switch (this.tag.tagNumber) {
            case 0x01: // BOOLEAN
              return this.stream.get(content) === 0 ? "false" : "true";
            case 0x02: // INTEGER
              return this.stream.parseInteger(content, content + len);
            case 0x03: // BIT_STRING
              return this.sub
                ? "(" + this.sub.length + " elem)"
                : this.stream.parseBitString(content, content + len, maxLength);
            case 0x04: // OCTET_STRING
              return this.sub
                ? "(" + this.sub.length + " elem)"
                : this.stream.parseOctetString(
                    content,
                    content + len,
                    maxLength
                  );
            // case 0x05: // NULL
            case 0x06: // OBJECT_IDENTIFIER
              return this.stream.parseOID(content, content + len, maxLength);
            // case 0x07: // ObjectDescriptor
            // case 0x08: // EXTERNAL
            // case 0x09: // REAL
            // case 0x0A: // ENUMERATED
            // case 0x0B: // EMBEDDED_PDV
            case 0x10: // SEQUENCE
            case 0x11: // SET
              if (this.sub !== null) {
                return "(" + this.sub.length + " elem)";
              } else {
                return "(no elem)";
              }
            case 0x0c: // UTF8String
              return stringCut(
                this.stream.parseStringUTF(content, content + len),
                maxLength
              );
            case 0x12: // NumericString
            case 0x13: // PrintableString
            case 0x14: // TeletexString
            case 0x15: // VideotexString
            case 0x16: // IA5String
            // case 0x19: // GraphicString
            case 0x1a: // VisibleString
              // case 0x1B: // GeneralString
              // case 0x1C: // UniversalString
              return stringCut(
                this.stream.parseStringISO(content, content + len),
                maxLength
              );
            case 0x1e: // BMPString
              return stringCut(
                this.stream.parseStringBMP(content, content + len),
                maxLength
              );
            case 0x17: // UTCTime
            case 0x18: // GeneralizedTime
              return this.stream.parseTime(
                content,
                content + len,
                this.tag.tagNumber == 0x17
              );
          }
          return null;
        };
        ASN1.prototype.toString = function () {
          return (
            this.typeName() +
            "@" +
            this.stream.pos +
            "[header:" +
            this.header +
            ",length:" +
            this.length +
            ",sub:" +
            (this.sub === null ? "null" : this.sub.length) +
            "]"
          );
        };
        ASN1.prototype.toPrettyString = function (indent) {
          if (indent === undefined) {
            indent = "";
          }
          var s = indent + this.typeName() + " @" + this.stream.pos;
          if (this.length >= 0) {
            s += "+";
          }
          s += this.length;
          if (this.tag.tagConstructed) {
            s += " (constructed)";
          } else if (
            this.tag.isUniversal() &&
            (this.tag.tagNumber == 0x03 || this.tag.tagNumber == 0x04) &&
            this.sub !== null
          ) {
            s += " (encapsulates)";
          }
          s += "\n";
          if (this.sub !== null) {
            indent += "  ";
            for (var i = 0, max = this.sub.length; i < max; ++i) {
              s += this.sub[i].toPrettyString(indent);
            }
          }
          return s;
        };
        ASN1.prototype.posStart = function () {
          return this.stream.pos;
        };
        ASN1.prototype.posContent = function () {
          return this.stream.pos + this.header;
        };
        ASN1.prototype.posEnd = function () {
          return this.stream.pos + this.header + Math.abs(this.length);
        };
        ASN1.prototype.toHexString = function () {
          return this.stream.hexDump(this.posStart(), this.posEnd(), true);
        };
        ASN1.decodeLength = function (stream) {
          var buf = stream.get();
          var len = buf & 0x7f;
          if (len == buf) {
            return len;
          }
          // no reason to use Int10, as it would be a huge buffer anyways
          if (len > 6) {
            throw new Error(
              "Length over 48 bits not supported at position " +
                (stream.pos - 1)
            );
          }
          if (len === 0) {
            return null;
          } // undefined
          buf = 0;
          for (var i = 0; i < len; ++i) {
            buf = buf * 256 + stream.get();
          }
          return buf;
        };
        /**
         * Retrieve the hexadecimal value (as a string) of the current ASN.1 element
         * @returns {string}
         * @public
         */
        ASN1.prototype.getHexStringValue = function () {
          var hexString = this.toHexString();
          var offset = this.header * 2;
          var length = this.length * 2;
          return hexString.substr(offset, length);
        };
        ASN1.decode = function (str) {
          var stream;
          if (!(str instanceof Stream)) {
            stream = new Stream(str, 0);
          } else {
            stream = str;
          }
          var streamStart = new Stream(stream);
          var tag = new ASN1Tag(stream);
          var len = ASN1.decodeLength(stream);
          var start = stream.pos;
          var header = start - streamStart.pos;
          var sub = null;
          var getSub = function () {
            var ret = [];
            if (len !== null) {
              // definite length
              var end = start + len;
              while (stream.pos < end) {
                ret[ret.length] = ASN1.decode(stream);
              }
              if (stream.pos != end) {
                throw new Error(
                  "Content size is not correct for container starting at offset " +
                    start
                );
              }
            } else {
              // undefined length
              try {
                for (;;) {
                  var s = ASN1.decode(stream);
                  if (s.tag.isEOC()) {
                    break;
                  }
                  ret[ret.length] = s;
                }
                len = start - stream.pos; // undefined lengths are represented as negative values
              } catch (e) {
                throw new Error(
                  "Exception while decoding undefined length content: " + e
                );
              }
            }
            return ret;
          };
          if (tag.tagConstructed) {
            // must have valid content
            sub = getSub();
          } else if (
            tag.isUniversal() &&
            (tag.tagNumber == 0x03 || tag.tagNumber == 0x04)
          ) {
            // sometimes BitString and OctetString are used to encapsulate ASN.1
            try {
              if (tag.tagNumber == 0x03) {
                if (stream.get() != 0) {
                  throw new Error(
                    "BIT STRINGs with unused bits cannot encapsulate."
                  );
                }
              }
              sub = getSub();
              for (var i = 0; i < sub.length; ++i) {
                if (sub[i].tag.isEOC()) {
                  throw new Error("EOC is not supposed to be actual content.");
                }
              }
            } catch (e) {
              // but silently ignore when they don't
              sub = null;
            }
          }
          if (sub === null) {
            if (len === null) {
              throw new Error(
                "We can't skip over an invalid tag with undefined length at offset " +
                  start
              );
            }
            stream.pos = start + Math.abs(len);
          }
          return new ASN1(streamStart, header, len, tag, sub);
        };
        return ASN1;
      })();
      var ASN1Tag = /** @class */ (function () {
        function ASN1Tag(stream) {
          var buf = stream.get();
          this.tagClass = buf >> 6;
          this.tagConstructed = (buf & 0x20) !== 0;
          this.tagNumber = buf & 0x1f;
          if (this.tagNumber == 0x1f) {
            // long tag
            var n = new Int10();
            do {
              buf = stream.get();
              n.mulAdd(128, buf & 0x7f);
            } while (buf & 0x80);
            this.tagNumber = n.simplify();
          }
        }
        ASN1Tag.prototype.isUniversal = function () {
          return this.tagClass === 0x00;
        };
        ASN1Tag.prototype.isEOC = function () {
          return this.tagClass === 0x00 && this.tagNumber === 0x00;
        };
        return ASN1Tag;
      })();

      // Copyright (c) 2005  Tom Wu
      // Bits per digit
      var dbits;
      //#region
      var lowprimes = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67,
        71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139,
        149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223,
        227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293,
        307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383,
        389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463,
        467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569,
        571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647,
        653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743,
        751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839,
        853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941,
        947, 953, 967, 971, 977, 983, 991, 997,
      ];
      var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];
      //#endregion
      // (public) Constructor
      var BigInteger = /** @class */ (function () {
        function BigInteger(a, b, c) {
          if (a != null) {
            if ("number" == typeof a) {
              this.fromNumber(a, b, c);
            } else if (b == null && "string" != typeof a) {
              this.fromString(a, 256);
            } else {
              this.fromString(a, b);
            }
          }
        }
        //#region PUBLIC
        // BigInteger.prototype.toString = bnToString;
        // (public) return string representation in given radix
        BigInteger.prototype.toString = function (b) {
          if (this.s < 0) {
            return "-" + this.negate().toString(b);
          }
          var k;
          if (b == 16) {
            k = 4;
          } else if (b == 8) {
            k = 3;
          } else if (b == 2) {
            k = 1;
          } else if (b == 32) {
            k = 5;
          } else if (b == 4) {
            k = 2;
          } else {
            return this.toRadix(b);
          }
          var km = (1 << k) - 1;
          var d;
          var m = false;
          var r = "";
          var i = this.t;
          var p = this.DB - ((i * this.DB) % k);
          if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) > 0) {
              m = true;
              r = int2char(d);
            }
            while (i >= 0) {
              if (p < k) {
                d = (this[i] & ((1 << p) - 1)) << (k - p);
                d |= this[--i] >> (p += this.DB - k);
              } else {
                d = (this[i] >> (p -= k)) & km;
                if (p <= 0) {
                  p += this.DB;
                  --i;
                }
              }
              if (d > 0) {
                m = true;
              }
              if (m) {
                r += int2char(d);
              }
            }
          }
          return m ? r : "0";
        };
        // BigInteger.prototype.negate = bnNegate;
        // (public) -this
        BigInteger.prototype.negate = function () {
          var r = nbi();
          BigInteger.ZERO.subTo(this, r);
          return r;
        };
        // BigInteger.prototype.abs = bnAbs;
        // (public) |this|
        BigInteger.prototype.abs = function () {
          return this.s < 0 ? this.negate() : this;
        };
        // BigInteger.prototype.compareTo = bnCompareTo;
        // (public) return + if this > a, - if this < a, 0 if equal
        BigInteger.prototype.compareTo = function (a) {
          var r = this.s - a.s;
          if (r != 0) {
            return r;
          }
          var i = this.t;
          r = i - a.t;
          if (r != 0) {
            return this.s < 0 ? -r : r;
          }
          while (--i >= 0) {
            if ((r = this[i] - a[i]) != 0) {
              return r;
            }
          }
          return 0;
        };
        // BigInteger.prototype.bitLength = bnBitLength;
        // (public) return the number of bits in "this"
        BigInteger.prototype.bitLength = function () {
          if (this.t <= 0) {
            return 0;
          }
          return (
            this.DB * (this.t - 1) +
            nbits(this[this.t - 1] ^ (this.s & this.DM))
          );
        };
        // BigInteger.prototype.mod = bnMod;
        // (public) this mod a
        BigInteger.prototype.mod = function (a) {
          var r = nbi();
          this.abs().divRemTo(a, null, r);
          if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
            a.subTo(r, r);
          }
          return r;
        };
        // BigInteger.prototype.modPowInt = bnModPowInt;
        // (public) this^e % m, 0 <= e < 2^32
        BigInteger.prototype.modPowInt = function (e, m) {
          var z;
          if (e < 256 || m.isEven()) {
            z = new Classic(m);
          } else {
            z = new Montgomery(m);
          }
          return this.exp(e, z);
        };
        // BigInteger.prototype.clone = bnClone;
        // (public)
        BigInteger.prototype.clone = function () {
          var r = nbi();
          this.copyTo(r);
          return r;
        };
        // BigInteger.prototype.intValue = bnIntValue;
        // (public) return value as integer
        BigInteger.prototype.intValue = function () {
          if (this.s < 0) {
            if (this.t == 1) {
              return this[0] - this.DV;
            } else if (this.t == 0) {
              return -1;
            }
          } else if (this.t == 1) {
            return this[0];
          } else if (this.t == 0) {
            return 0;
          }
          // assumes 16 < DB < 32
          return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0];
        };
        // BigInteger.prototype.byteValue = bnByteValue;
        // (public) return value as byte
        BigInteger.prototype.byteValue = function () {
          return this.t == 0 ? this.s : (this[0] << 24) >> 24;
        };
        // BigInteger.prototype.shortValue = bnShortValue;
        // (public) return value as short (assumes DB>=16)
        BigInteger.prototype.shortValue = function () {
          return this.t == 0 ? this.s : (this[0] << 16) >> 16;
        };
        // BigInteger.prototype.signum = bnSigNum;
        // (public) 0 if this == 0, 1 if this > 0
        BigInteger.prototype.signum = function () {
          if (this.s < 0) {
            return -1;
          } else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) {
            return 0;
          } else {
            return 1;
          }
        };
        // BigInteger.prototype.toByteArray = bnToByteArray;
        // (public) convert to bigendian byte array
        BigInteger.prototype.toByteArray = function () {
          var i = this.t;
          var r = [];
          r[0] = this.s;
          var p = this.DB - ((i * this.DB) % 8);
          var d;
          var k = 0;
          if (i-- > 0) {
            if (p < this.DB && (d = this[i] >> p) != (this.s & this.DM) >> p) {
              r[k++] = d | (this.s << (this.DB - p));
            }
            while (i >= 0) {
              if (p < 8) {
                d = (this[i] & ((1 << p) - 1)) << (8 - p);
                d |= this[--i] >> (p += this.DB - 8);
              } else {
                d = (this[i] >> (p -= 8)) & 0xff;
                if (p <= 0) {
                  p += this.DB;
                  --i;
                }
              }
              if ((d & 0x80) != 0) {
                d |= -256;
              }
              if (k == 0 && (this.s & 0x80) != (d & 0x80)) {
                ++k;
              }
              if (k > 0 || d != this.s) {
                r[k++] = d;
              }
            }
          }
          return r;
        };
        // BigInteger.prototype.equals = bnEquals;
        BigInteger.prototype.equals = function (a) {
          return this.compareTo(a) == 0;
        };
        // BigInteger.prototype.min = bnMin;
        BigInteger.prototype.min = function (a) {
          return this.compareTo(a) < 0 ? this : a;
        };
        // BigInteger.prototype.max = bnMax;
        BigInteger.prototype.max = function (a) {
          return this.compareTo(a) > 0 ? this : a;
        };
        // BigInteger.prototype.and = bnAnd;
        BigInteger.prototype.and = function (a) {
          var r = nbi();
          this.bitwiseTo(a, op_and, r);
          return r;
        };
        // BigInteger.prototype.or = bnOr;
        BigInteger.prototype.or = function (a) {
          var r = nbi();
          this.bitwiseTo(a, op_or, r);
          return r;
        };
        // BigInteger.prototype.xor = bnXor;
        BigInteger.prototype.xor = function (a) {
          var r = nbi();
          this.bitwiseTo(a, op_xor, r);
          return r;
        };
        // BigInteger.prototype.andNot = bnAndNot;
        BigInteger.prototype.andNot = function (a) {
          var r = nbi();
          this.bitwiseTo(a, op_andnot, r);
          return r;
        };
        // BigInteger.prototype.not = bnNot;
        // (public) ~this
        BigInteger.prototype.not = function () {
          var r = nbi();
          for (var i = 0; i < this.t; ++i) {
            r[i] = this.DM & ~this[i];
          }
          r.t = this.t;
          r.s = ~this.s;
          return r;
        };
        // BigInteger.prototype.shiftLeft = bnShiftLeft;
        // (public) this << n
        BigInteger.prototype.shiftLeft = function (n) {
          var r = nbi();
          if (n < 0) {
            this.rShiftTo(-n, r);
          } else {
            this.lShiftTo(n, r);
          }
          return r;
        };
        // BigInteger.prototype.shiftRight = bnShiftRight;
        // (public) this >> n
        BigInteger.prototype.shiftRight = function (n) {
          var r = nbi();
          if (n < 0) {
            this.lShiftTo(-n, r);
          } else {
            this.rShiftTo(n, r);
          }
          return r;
        };
        // BigInteger.prototype.getLowestSetBit = bnGetLowestSetBit;
        // (public) returns index of lowest 1-bit (or -1 if none)
        BigInteger.prototype.getLowestSetBit = function () {
          for (var i = 0; i < this.t; ++i) {
            if (this[i] != 0) {
              return i * this.DB + lbit(this[i]);
            }
          }
          if (this.s < 0) {
            return this.t * this.DB;
          }
          return -1;
        };
        // BigInteger.prototype.bitCount = bnBitCount;
        // (public) return number of set bits
        BigInteger.prototype.bitCount = function () {
          var r = 0;
          var x = this.s & this.DM;
          for (var i = 0; i < this.t; ++i) {
            r += cbit(this[i] ^ x);
          }
          return r;
        };
        // BigInteger.prototype.testBit = bnTestBit;
        // (public) true iff nth bit is set
        BigInteger.prototype.testBit = function (n) {
          var j = Math.floor(n / this.DB);
          if (j >= this.t) {
            return this.s != 0;
          }
          return (this[j] & (1 << n % this.DB)) != 0;
        };
        // BigInteger.prototype.setBit = bnSetBit;
        // (public) this | (1<<n)
        BigInteger.prototype.setBit = function (n) {
          return this.changeBit(n, op_or);
        };
        // BigInteger.prototype.clearBit = bnClearBit;
        // (public) this & ~(1<<n)
        BigInteger.prototype.clearBit = function (n) {
          return this.changeBit(n, op_andnot);
        };
        // BigInteger.prototype.flipBit = bnFlipBit;
        // (public) this ^ (1<<n)
        BigInteger.prototype.flipBit = function (n) {
          return this.changeBit(n, op_xor);
        };
        // BigInteger.prototype.add = bnAdd;
        // (public) this + a
        BigInteger.prototype.add = function (a) {
          var r = nbi();
          this.addTo(a, r);
          return r;
        };
        // BigInteger.prototype.subtract = bnSubtract;
        // (public) this - a
        BigInteger.prototype.subtract = function (a) {
          var r = nbi();
          this.subTo(a, r);
          return r;
        };
        // BigInteger.prototype.multiply = bnMultiply;
        // (public) this * a
        BigInteger.prototype.multiply = function (a) {
          var r = nbi();
          this.multiplyTo(a, r);
          return r;
        };
        // BigInteger.prototype.divide = bnDivide;
        // (public) this / a
        BigInteger.prototype.divide = function (a) {
          var r = nbi();
          this.divRemTo(a, r, null);
          return r;
        };
        // BigInteger.prototype.remainder = bnRemainder;
        // (public) this % a
        BigInteger.prototype.remainder = function (a) {
          var r = nbi();
          this.divRemTo(a, null, r);
          return r;
        };
        // BigInteger.prototype.divideAndRemainder = bnDivideAndRemainder;
        // (public) [this/a,this%a]
        BigInteger.prototype.divideAndRemainder = function (a) {
          var q = nbi();
          var r = nbi();
          this.divRemTo(a, q, r);
          return [q, r];
        };
        // BigInteger.prototype.modPow = bnModPow;
        // (public) this^e % m (HAC 14.85)
        BigInteger.prototype.modPow = function (e, m) {
          var i = e.bitLength();
          var k;
          var r = nbv(1);
          var z;
          if (i <= 0) {
            return r;
          } else if (i < 18) {
            k = 1;
          } else if (i < 48) {
            k = 3;
          } else if (i < 144) {
            k = 4;
          } else if (i < 768) {
            k = 5;
          } else {
            k = 6;
          }
          if (i < 8) {
            z = new Classic(m);
          } else if (m.isEven()) {
            z = new Barrett(m);
          } else {
            z = new Montgomery(m);
          }
          // precomputation
          var g = [];
          var n = 3;
          var k1 = k - 1;
          var km = (1 << k) - 1;
          g[1] = z.convert(this);
          if (k > 1) {
            var g2 = nbi();
            z.sqrTo(g[1], g2);
            while (n <= km) {
              g[n] = nbi();
              z.mulTo(g2, g[n - 2], g[n]);
              n += 2;
            }
          }
          var j = e.t - 1;
          var w;
          var is1 = true;
          var r2 = nbi();
          var t;
          i = nbits(e[j]) - 1;
          while (j >= 0) {
            if (i >= k1) {
              w = (e[j] >> (i - k1)) & km;
            } else {
              w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i);
              if (j > 0) {
                w |= e[j - 1] >> (this.DB + i - k1);
              }
            }
            n = k;
            while ((w & 1) == 0) {
              w >>= 1;
              --n;
            }
            if ((i -= n) < 0) {
              i += this.DB;
              --j;
            }
            if (is1) {
              // ret == 1, don't bother squaring or multiplying it
              g[w].copyTo(r);
              is1 = false;
            } else {
              while (n > 1) {
                z.sqrTo(r, r2);
                z.sqrTo(r2, r);
                n -= 2;
              }
              if (n > 0) {
                z.sqrTo(r, r2);
              } else {
                t = r;
                r = r2;
                r2 = t;
              }
              z.mulTo(r2, g[w], r);
            }
            while (j >= 0 && (e[j] & (1 << i)) == 0) {
              z.sqrTo(r, r2);
              t = r;
              r = r2;
              r2 = t;
              if (--i < 0) {
                i = this.DB - 1;
                --j;
              }
            }
          }
          return z.revert(r);
        };
        // BigInteger.prototype.modInverse = bnModInverse;
        // (public) 1/this % m (HAC 14.61)
        BigInteger.prototype.modInverse = function (m) {
          var ac = m.isEven();
          if ((this.isEven() && ac) || m.signum() == 0) {
            return BigInteger.ZERO;
          }
          var u = m.clone();
          var v = this.clone();
          var a = nbv(1);
          var b = nbv(0);
          var c = nbv(0);
          var d = nbv(1);
          while (u.signum() != 0) {
            while (u.isEven()) {
              u.rShiftTo(1, u);
              if (ac) {
                if (!a.isEven() || !b.isEven()) {
                  a.addTo(this, a);
                  b.subTo(m, b);
                }
                a.rShiftTo(1, a);
              } else if (!b.isEven()) {
                b.subTo(m, b);
              }
              b.rShiftTo(1, b);
            }
            while (v.isEven()) {
              v.rShiftTo(1, v);
              if (ac) {
                if (!c.isEven() || !d.isEven()) {
                  c.addTo(this, c);
                  d.subTo(m, d);
                }
                c.rShiftTo(1, c);
              } else if (!d.isEven()) {
                d.subTo(m, d);
              }
              d.rShiftTo(1, d);
            }
            if (u.compareTo(v) >= 0) {
              u.subTo(v, u);
              if (ac) {
                a.subTo(c, a);
              }
              b.subTo(d, b);
            } else {
              v.subTo(u, v);
              if (ac) {
                c.subTo(a, c);
              }
              d.subTo(b, d);
            }
          }
          if (v.compareTo(BigInteger.ONE) != 0) {
            return BigInteger.ZERO;
          }
          if (d.compareTo(m) >= 0) {
            return d.subtract(m);
          }
          if (d.signum() < 0) {
            d.addTo(m, d);
          } else {
            return d;
          }
          if (d.signum() < 0) {
            return d.add(m);
          } else {
            return d;
          }
        };
        // BigInteger.prototype.pow = bnPow;
        // (public) this^e
        BigInteger.prototype.pow = function (e) {
          return this.exp(e, new NullExp());
        };
        // BigInteger.prototype.gcd = bnGCD;
        // (public) gcd(this,a) (HAC 14.54)
        BigInteger.prototype.gcd = function (a) {
          var x = this.s < 0 ? this.negate() : this.clone();
          var y = a.s < 0 ? a.negate() : a.clone();
          if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
          }
          var i = x.getLowestSetBit();
          var g = y.getLowestSetBit();
          if (g < 0) {
            return x;
          }
          if (i < g) {
            g = i;
          }
          if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
          }
          while (x.signum() > 0) {
            if ((i = x.getLowestSetBit()) > 0) {
              x.rShiftTo(i, x);
            }
            if ((i = y.getLowestSetBit()) > 0) {
              y.rShiftTo(i, y);
            }
            if (x.compareTo(y) >= 0) {
              x.subTo(y, x);
              x.rShiftTo(1, x);
            } else {
              y.subTo(x, y);
              y.rShiftTo(1, y);
            }
          }
          if (g > 0) {
            y.lShiftTo(g, y);
          }
          return y;
        };
        // BigInteger.prototype.isProbablePrime = bnIsProbablePrime;
        // (public) test primality with certainty >= 1-.5^t
        BigInteger.prototype.isProbablePrime = function (t) {
          var i;
          var x = this.abs();
          if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
            for (i = 0; i < lowprimes.length; ++i) {
              if (x[0] == lowprimes[i]) {
                return true;
              }
            }
            return false;
          }
          if (x.isEven()) {
            return false;
          }
          i = 1;
          while (i < lowprimes.length) {
            var m = lowprimes[i];
            var j = i + 1;
            while (j < lowprimes.length && m < lplim) {
              m *= lowprimes[j++];
            }
            m = x.modInt(m);
            while (i < j) {
              if (m % lowprimes[i++] == 0) {
                return false;
              }
            }
          }
          return x.millerRabin(t);
        };
        //#endregion PUBLIC
        //#region PROTECTED
        // BigInteger.prototype.copyTo = bnpCopyTo;
        // (protected) copy this to r
        BigInteger.prototype.copyTo = function (r) {
          for (var i = this.t - 1; i >= 0; --i) {
            r[i] = this[i];
          }
          r.t = this.t;
          r.s = this.s;
        };
        // BigInteger.prototype.fromInt = bnpFromInt;
        // (protected) set from integer value x, -DV <= x < DV
        BigInteger.prototype.fromInt = function (x) {
          this.t = 1;
          this.s = x < 0 ? -1 : 0;
          if (x > 0) {
            this[0] = x;
          } else if (x < -1) {
            this[0] = x + this.DV;
          } else {
            this.t = 0;
          }
        };
        // BigInteger.prototype.fromString = bnpFromString;
        // (protected) set from string and radix
        BigInteger.prototype.fromString = function (s, b) {
          var k;
          if (b == 16) {
            k = 4;
          } else if (b == 8) {
            k = 3;
          } else if (b == 256) {
            k = 8;
            /* byte array */
          } else if (b == 2) {
            k = 1;
          } else if (b == 32) {
            k = 5;
          } else if (b == 4) {
            k = 2;
          } else {
            this.fromRadix(s, b);
            return;
          }
          this.t = 0;
          this.s = 0;
          var i = s.length;
          var mi = false;
          var sh = 0;
          while (--i >= 0) {
            var x = k == 8 ? +s[i] & 0xff : intAt(s, i);
            if (x < 0) {
              if (s.charAt(i) == "-") {
                mi = true;
              }
              continue;
            }
            mi = false;
            if (sh == 0) {
              this[this.t++] = x;
            } else if (sh + k > this.DB) {
              this[this.t - 1] |= (x & ((1 << (this.DB - sh)) - 1)) << sh;
              this[this.t++] = x >> (this.DB - sh);
            } else {
              this[this.t - 1] |= x << sh;
            }
            sh += k;
            if (sh >= this.DB) {
              sh -= this.DB;
            }
          }
          if (k == 8 && (+s[0] & 0x80) != 0) {
            this.s = -1;
            if (sh > 0) {
              this[this.t - 1] |= ((1 << (this.DB - sh)) - 1) << sh;
            }
          }
          this.clamp();
          if (mi) {
            BigInteger.ZERO.subTo(this, this);
          }
        };
        // BigInteger.prototype.clamp = bnpClamp;
        // (protected) clamp off excess high words
        BigInteger.prototype.clamp = function () {
          var c = this.s & this.DM;
          while (this.t > 0 && this[this.t - 1] == c) {
            --this.t;
          }
        };
        // BigInteger.prototype.dlShiftTo = bnpDLShiftTo;
        // (protected) r = this << n*DB
        BigInteger.prototype.dlShiftTo = function (n, r) {
          var i;
          for (i = this.t - 1; i >= 0; --i) {
            r[i + n] = this[i];
          }
          for (i = n - 1; i >= 0; --i) {
            r[i] = 0;
          }
          r.t = this.t + n;
          r.s = this.s;
        };
        // BigInteger.prototype.drShiftTo = bnpDRShiftTo;
        // (protected) r = this >> n*DB
        BigInteger.prototype.drShiftTo = function (n, r) {
          for (var i = n; i < this.t; ++i) {
            r[i - n] = this[i];
          }
          r.t = Math.max(this.t - n, 0);
          r.s = this.s;
        };
        // BigInteger.prototype.lShiftTo = bnpLShiftTo;
        // (protected) r = this << n
        BigInteger.prototype.lShiftTo = function (n, r) {
          var bs = n % this.DB;
          var cbs = this.DB - bs;
          var bm = (1 << cbs) - 1;
          var ds = Math.floor(n / this.DB);
          var c = (this.s << bs) & this.DM;
          for (var i = this.t - 1; i >= 0; --i) {
            r[i + ds + 1] = (this[i] >> cbs) | c;
            c = (this[i] & bm) << bs;
          }
          for (var i = ds - 1; i >= 0; --i) {
            r[i] = 0;
          }
          r[ds] = c;
          r.t = this.t + ds + 1;
          r.s = this.s;
          r.clamp();
        };
        // BigInteger.prototype.rShiftTo = bnpRShiftTo;
        // (protected) r = this >> n
        BigInteger.prototype.rShiftTo = function (n, r) {
          r.s = this.s;
          var ds = Math.floor(n / this.DB);
          if (ds >= this.t) {
            r.t = 0;
            return;
          }
          var bs = n % this.DB;
          var cbs = this.DB - bs;
          var bm = (1 << bs) - 1;
          r[0] = this[ds] >> bs;
          for (var i = ds + 1; i < this.t; ++i) {
            r[i - ds - 1] |= (this[i] & bm) << cbs;
            r[i - ds] = this[i] >> bs;
          }
          if (bs > 0) {
            r[this.t - ds - 1] |= (this.s & bm) << cbs;
          }
          r.t = this.t - ds;
          r.clamp();
        };
        // BigInteger.prototype.subTo = bnpSubTo;
        // (protected) r = this - a
        BigInteger.prototype.subTo = function (a, r) {
          var i = 0;
          var c = 0;
          var m = Math.min(a.t, this.t);
          while (i < m) {
            c += this[i] - a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
          }
          if (a.t < this.t) {
            c -= a.s;
            while (i < this.t) {
              c += this[i];
              r[i++] = c & this.DM;
              c >>= this.DB;
            }
            c += this.s;
          } else {
            c += this.s;
            while (i < a.t) {
              c -= a[i];
              r[i++] = c & this.DM;
              c >>= this.DB;
            }
            c -= a.s;
          }
          r.s = c < 0 ? -1 : 0;
          if (c < -1) {
            r[i++] = this.DV + c;
          } else if (c > 0) {
            r[i++] = c;
          }
          r.t = i;
          r.clamp();
        };
        // BigInteger.prototype.multiplyTo = bnpMultiplyTo;
        // (protected) r = this * a, r != this,a (HAC 14.12)
        // "this" should be the larger one if appropriate.
        BigInteger.prototype.multiplyTo = function (a, r) {
          var x = this.abs();
          var y = a.abs();
          var i = x.t;
          r.t = i + y.t;
          while (--i >= 0) {
            r[i] = 0;
          }
          for (i = 0; i < y.t; ++i) {
            r[i + x.t] = x.am(0, y[i], r, i, 0, x.t);
          }
          r.s = 0;
          r.clamp();
          if (this.s != a.s) {
            BigInteger.ZERO.subTo(r, r);
          }
        };
        // BigInteger.prototype.squareTo = bnpSquareTo;
        // (protected) r = this^2, r != this (HAC 14.16)
        BigInteger.prototype.squareTo = function (r) {
          var x = this.abs();
          var i = (r.t = 2 * x.t);
          while (--i >= 0) {
            r[i] = 0;
          }
          for (i = 0; i < x.t - 1; ++i) {
            var c = x.am(i, x[i], r, 2 * i, 0, 1);
            if (
              (r[i + x.t] += x.am(
                i + 1,
                2 * x[i],
                r,
                2 * i + 1,
                c,
                x.t - i - 1
              )) >= x.DV
            ) {
              r[i + x.t] -= x.DV;
              r[i + x.t + 1] = 1;
            }
          }
          if (r.t > 0) {
            r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1);
          }
          r.s = 0;
          r.clamp();
        };
        // BigInteger.prototype.divRemTo = bnpDivRemTo;
        // (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
        // r != q, this != m.  q or r may be null.
        BigInteger.prototype.divRemTo = function (m, q, r) {
          var pm = m.abs();
          if (pm.t <= 0) {
            return;
          }
          var pt = this.abs();
          if (pt.t < pm.t) {
            if (q != null) {
              q.fromInt(0);
            }
            if (r != null) {
              this.copyTo(r);
            }
            return;
          }
          if (r == null) {
            r = nbi();
          }
          var y = nbi();
          var ts = this.s;
          var ms = m.s;
          var nsh = this.DB - nbits(pm[pm.t - 1]); // normalize modulus
          if (nsh > 0) {
            pm.lShiftTo(nsh, y);
            pt.lShiftTo(nsh, r);
          } else {
            pm.copyTo(y);
            pt.copyTo(r);
          }
          var ys = y.t;
          var y0 = y[ys - 1];
          if (y0 == 0) {
            return;
          }
          var yt = y0 * (1 << this.F1) + (ys > 1 ? y[ys - 2] >> this.F2 : 0);
          var d1 = this.FV / yt;
          var d2 = (1 << this.F1) / yt;
          var e = 1 << this.F2;
          var i = r.t;
          var j = i - ys;
          var t = q == null ? nbi() : q;
          y.dlShiftTo(j, t);
          if (r.compareTo(t) >= 0) {
            r[r.t++] = 1;
            r.subTo(t, r);
          }
          BigInteger.ONE.dlShiftTo(ys, t);
          t.subTo(y, y); // "negative" y so we can replace sub with am later
          while (y.t < ys) {
            y[y.t++] = 0;
          }
          while (--j >= 0) {
            // Estimate quotient digit
            var qd =
              r[--i] == y0
                ? this.DM
                : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2);
            if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) {
              // Try it out
              y.dlShiftTo(j, t);
              r.subTo(t, r);
              while (r[i] < --qd) {
                r.subTo(t, r);
              }
            }
          }
          if (q != null) {
            r.drShiftTo(ys, q);
            if (ts != ms) {
              BigInteger.ZERO.subTo(q, q);
            }
          }
          r.t = ys;
          r.clamp();
          if (nsh > 0) {
            r.rShiftTo(nsh, r);
          } // Denormalize remainder
          if (ts < 0) {
            BigInteger.ZERO.subTo(r, r);
          }
        };
        // BigInteger.prototype.invDigit = bnpInvDigit;
        // (protected) return "-1/this % 2^DB"; useful for Mont. reduction
        // justification:
        //         xy == 1 (mod m)
        //         xy =  1+km
        //   xy(2-xy) = (1+km)(1-km)
        // x[y(2-xy)] = 1-k^2m^2
        // x[y(2-xy)] == 1 (mod m^2)
        // if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
        // should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
        // JS multiply "overflows" differently from C/C++, so care is needed here.
        BigInteger.prototype.invDigit = function () {
          if (this.t < 1) {
            return 0;
          }
          var x = this[0];
          if ((x & 1) == 0) {
            return 0;
          }
          var y = x & 3; // y == 1/x mod 2^2
          y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
          y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
          y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
          // last step - calculate inverse mod DV directly;
          // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
          y = (y * (2 - ((x * y) % this.DV))) % this.DV; // y == 1/x mod 2^dbits
          // we really want the negative inverse, and -DV < y < DV
          return y > 0 ? this.DV - y : -y;
        };
        // BigInteger.prototype.isEven = bnpIsEven;
        // (protected) true iff this is even
        BigInteger.prototype.isEven = function () {
          return (this.t > 0 ? this[0] & 1 : this.s) == 0;
        };
        // BigInteger.prototype.exp = bnpExp;
        // (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
        BigInteger.prototype.exp = function (e, z) {
          if (e > 0xffffffff || e < 1) {
            return BigInteger.ONE;
          }
          var r = nbi();
          var r2 = nbi();
          var g = z.convert(this);
          var i = nbits(e) - 1;
          g.copyTo(r);
          while (--i >= 0) {
            z.sqrTo(r, r2);
            if ((e & (1 << i)) > 0) {
              z.mulTo(r2, g, r);
            } else {
              var t = r;
              r = r2;
              r2 = t;
            }
          }
          return z.revert(r);
        };
        // BigInteger.prototype.chunkSize = bnpChunkSize;
        // (protected) return x s.t. r^x < DV
        BigInteger.prototype.chunkSize = function (r) {
          return Math.floor((Math.LN2 * this.DB) / Math.log(r));
        };
        // BigInteger.prototype.toRadix = bnpToRadix;
        // (protected) convert to radix string
        BigInteger.prototype.toRadix = function (b) {
          if (b == null) {
            b = 10;
          }
          if (this.signum() == 0 || b < 2 || b > 36) {
            return "0";
          }
          var cs = this.chunkSize(b);
          var a = Math.pow(b, cs);
          var d = nbv(a);
          var y = nbi();
          var z = nbi();
          var r = "";
          this.divRemTo(d, y, z);
          while (y.signum() > 0) {
            r = (a + z.intValue()).toString(b).substr(1) + r;
            y.divRemTo(d, y, z);
          }
          return z.intValue().toString(b) + r;
        };
        // BigInteger.prototype.fromRadix = bnpFromRadix;
        // (protected) convert from radix string
        BigInteger.prototype.fromRadix = function (s, b) {
          this.fromInt(0);
          if (b == null) {
            b = 10;
          }
          var cs = this.chunkSize(b);
          var d = Math.pow(b, cs);
          var mi = false;
          var j = 0;
          var w = 0;
          for (var i = 0; i < s.length; ++i) {
            var x = intAt(s, i);
            if (x < 0) {
              if (s.charAt(i) == "-" && this.signum() == 0) {
                mi = true;
              }
              continue;
            }
            w = b * w + x;
            if (++j >= cs) {
              this.dMultiply(d);
              this.dAddOffset(w, 0);
              j = 0;
              w = 0;
            }
          }
          if (j > 0) {
            this.dMultiply(Math.pow(b, j));
            this.dAddOffset(w, 0);
          }
          if (mi) {
            BigInteger.ZERO.subTo(this, this);
          }
        };
        // BigInteger.prototype.fromNumber = bnpFromNumber;
        // (protected) alternate constructor
        BigInteger.prototype.fromNumber = function (a, b, c) {
          if ("number" == typeof b) {
            // new BigInteger(int,int,RNG)
            if (a < 2) {
              this.fromInt(1);
            } else {
              this.fromNumber(a, c);
              if (!this.testBit(a - 1)) {
                // force MSB set
                this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
              }
              if (this.isEven()) {
                this.dAddOffset(1, 0);
              } // force odd
              while (!this.isProbablePrime(b)) {
                this.dAddOffset(2, 0);
                if (this.bitLength() > a) {
                  this.subTo(BigInteger.ONE.shiftLeft(a - 1), this);
                }
              }
            }
          } else {
            // new BigInteger(int,RNG)
            var x = [];
            var t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) {
              x[0] &= (1 << t) - 1;
            } else {
              x[0] = 0;
            }
            this.fromString(x, 256);
          }
        };
        // BigInteger.prototype.bitwiseTo = bnpBitwiseTo;
        // (protected) r = this op a (bitwise)
        BigInteger.prototype.bitwiseTo = function (a, op, r) {
          var i;
          var f;
          var m = Math.min(a.t, this.t);
          for (i = 0; i < m; ++i) {
            r[i] = op(this[i], a[i]);
          }
          if (a.t < this.t) {
            f = a.s & this.DM;
            for (i = m; i < this.t; ++i) {
              r[i] = op(this[i], f);
            }
            r.t = this.t;
          } else {
            f = this.s & this.DM;
            for (i = m; i < a.t; ++i) {
              r[i] = op(f, a[i]);
            }
            r.t = a.t;
          }
          r.s = op(this.s, a.s);
          r.clamp();
        };
        // BigInteger.prototype.changeBit = bnpChangeBit;
        // (protected) this op (1<<n)
        BigInteger.prototype.changeBit = function (n, op) {
          var r = BigInteger.ONE.shiftLeft(n);
          this.bitwiseTo(r, op, r);
          return r;
        };
        // BigInteger.prototype.addTo = bnpAddTo;
        // (protected) r = this + a
        BigInteger.prototype.addTo = function (a, r) {
          var i = 0;
          var c = 0;
          var m = Math.min(a.t, this.t);
          while (i < m) {
            c += this[i] + a[i];
            r[i++] = c & this.DM;
            c >>= this.DB;
          }
          if (a.t < this.t) {
            c += a.s;
            while (i < this.t) {
              c += this[i];
              r[i++] = c & this.DM;
              c >>= this.DB;
            }
            c += this.s;
          } else {
            c += this.s;
            while (i < a.t) {
              c += a[i];
              r[i++] = c & this.DM;
              c >>= this.DB;
            }
            c += a.s;
          }
          r.s = c < 0 ? -1 : 0;
          if (c > 0) {
            r[i++] = c;
          } else if (c < -1) {
            r[i++] = this.DV + c;
          }
          r.t = i;
          r.clamp();
        };
        // BigInteger.prototype.dMultiply = bnpDMultiply;
        // (protected) this *= n, this >= 0, 1 < n < DV
        BigInteger.prototype.dMultiply = function (n) {
          this[this.t] = this.am(0, n - 1, this, 0, 0, this.t);
          ++this.t;
          this.clamp();
        };
        // BigInteger.prototype.dAddOffset = bnpDAddOffset;
        // (protected) this += n << w words, this >= 0
        BigInteger.prototype.dAddOffset = function (n, w) {
          if (n == 0) {
            return;
          }
          while (this.t <= w) {
            this[this.t++] = 0;
          }
          this[w] += n;
          while (this[w] >= this.DV) {
            this[w] -= this.DV;
            if (++w >= this.t) {
              this[this.t++] = 0;
            }
            ++this[w];
          }
        };
        // BigInteger.prototype.multiplyLowerTo = bnpMultiplyLowerTo;
        // (protected) r = lower n words of "this * a", a.t <= n
        // "this" should be the larger one if appropriate.
        BigInteger.prototype.multiplyLowerTo = function (a, n, r) {
          var i = Math.min(this.t + a.t, n);
          r.s = 0; // assumes a,this >= 0
          r.t = i;
          while (i > 0) {
            r[--i] = 0;
          }
          for (var j = r.t - this.t; i < j; ++i) {
            r[i + this.t] = this.am(0, a[i], r, i, 0, this.t);
          }
          for (var j = Math.min(a.t, n); i < j; ++i) {
            this.am(0, a[i], r, i, 0, n - i);
          }
          r.clamp();
        };
        // BigInteger.prototype.multiplyUpperTo = bnpMultiplyUpperTo;
        // (protected) r = "this * a" without lower n words, n > 0
        // "this" should be the larger one if appropriate.
        BigInteger.prototype.multiplyUpperTo = function (a, n, r) {
          --n;
          var i = (r.t = this.t + a.t - n);
          r.s = 0; // assumes a,this >= 0
          while (--i >= 0) {
            r[i] = 0;
          }
          for (i = Math.max(n - this.t, 0); i < a.t; ++i) {
            r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n);
          }
          r.clamp();
          r.drShiftTo(1, r);
        };
        // BigInteger.prototype.modInt = bnpModInt;
        // (protected) this % n, n < 2^26
        BigInteger.prototype.modInt = function (n) {
          if (n <= 0) {
            return 0;
          }
          var d = this.DV % n;
          var r = this.s < 0 ? n - 1 : 0;
          if (this.t > 0) {
            if (d == 0) {
              r = this[0] % n;
            } else {
              for (var i = this.t - 1; i >= 0; --i) {
                r = (d * r + this[i]) % n;
              }
            }
          }
          return r;
        };
        // BigInteger.prototype.millerRabin = bnpMillerRabin;
        // (protected) true if probably prime (HAC 4.24, Miller-Rabin)
        BigInteger.prototype.millerRabin = function (t) {
          var n1 = this.subtract(BigInteger.ONE);
          var k = n1.getLowestSetBit();
          if (k <= 0) {
            return false;
          }
          var r = n1.shiftRight(k);
          t = (t + 1) >> 1;
          if (t > lowprimes.length) {
            t = lowprimes.length;
          }
          var a = nbi();
          for (var i = 0; i < t; ++i) {
            // Pick bases at random, instead of starting at 2
            a.fromInt(lowprimes[Math.floor(Math.random() * lowprimes.length)]);
            var y = a.modPow(r, this);
            if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
              var j = 1;
              while (j++ < k && y.compareTo(n1) != 0) {
                y = y.modPowInt(2, this);
                if (y.compareTo(BigInteger.ONE) == 0) {
                  return false;
                }
              }
              if (y.compareTo(n1) != 0) {
                return false;
              }
            }
          }
          return true;
        };
        // BigInteger.prototype.square = bnSquare;
        // (public) this^2
        BigInteger.prototype.square = function () {
          var r = nbi();
          this.squareTo(r);
          return r;
        };
        //#region ASYNC
        // Public API method
        BigInteger.prototype.gcda = function (a, callback) {
          var x = this.s < 0 ? this.negate() : this.clone();
          var y = a.s < 0 ? a.negate() : a.clone();
          if (x.compareTo(y) < 0) {
            var t = x;
            x = y;
            y = t;
          }
          var i = x.getLowestSetBit();
          var g = y.getLowestSetBit();
          if (g < 0) {
            callback(x);
            return;
          }
          if (i < g) {
            g = i;
          }
          if (g > 0) {
            x.rShiftTo(g, x);
            y.rShiftTo(g, y);
          }
          // Workhorse of the algorithm, gets called 200 - 800 times per 512 bit keygen.
          var gcda1 = function () {
            if ((i = x.getLowestSetBit()) > 0) {
              x.rShiftTo(i, x);
            }
            if ((i = y.getLowestSetBit()) > 0) {
              y.rShiftTo(i, y);
            }
            if (x.compareTo(y) >= 0) {
              x.subTo(y, x);
              x.rShiftTo(1, x);
            } else {
              y.subTo(x, y);
              y.rShiftTo(1, y);
            }
            if (!(x.signum() > 0)) {
              if (g > 0) {
                y.lShiftTo(g, y);
              }
              setTimeout(function () {
                callback(y);
              }, 0); // escape
            } else {
              setTimeout(gcda1, 0);
            }
          };
          setTimeout(gcda1, 10);
        };
        // (protected) alternate constructor
        BigInteger.prototype.fromNumberAsync = function (a, b, c, callback) {
          if ("number" == typeof b) {
            if (a < 2) {
              this.fromInt(1);
            } else {
              this.fromNumber(a, c);
              if (!this.testBit(a - 1)) {
                this.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, this);
              }
              if (this.isEven()) {
                this.dAddOffset(1, 0);
              }
              var bnp_1 = this;
              var bnpfn1_1 = function () {
                bnp_1.dAddOffset(2, 0);
                if (bnp_1.bitLength() > a) {
                  bnp_1.subTo(BigInteger.ONE.shiftLeft(a - 1), bnp_1);
                }
                if (bnp_1.isProbablePrime(b)) {
                  setTimeout(function () {
                    callback();
                  }, 0); // escape
                } else {
                  setTimeout(bnpfn1_1, 0);
                }
              };
              setTimeout(bnpfn1_1, 0);
            }
          } else {
            var x = [];
            var t = a & 7;
            x.length = (a >> 3) + 1;
            b.nextBytes(x);
            if (t > 0) {
              x[0] &= (1 << t) - 1;
            } else {
              x[0] = 0;
            }
            this.fromString(x, 256);
          }
        };
        return BigInteger;
      })();
      //#region REDUCERS
      //#region NullExp
      var NullExp = /** @class */ (function () {
        function NullExp() {}
        // NullExp.prototype.convert = nNop;
        NullExp.prototype.convert = function (x) {
          return x;
        };
        // NullExp.prototype.revert = nNop;
        NullExp.prototype.revert = function (x) {
          return x;
        };
        // NullExp.prototype.mulTo = nMulTo;
        NullExp.prototype.mulTo = function (x, y, r) {
          x.multiplyTo(y, r);
        };
        // NullExp.prototype.sqrTo = nSqrTo;
        NullExp.prototype.sqrTo = function (x, r) {
          x.squareTo(r);
        };
        return NullExp;
      })();
      // Modular reduction using "classic" algorithm
      var Classic = /** @class */ (function () {
        function Classic(m) {
          this.m = m;
        }
        // Classic.prototype.convert = cConvert;
        Classic.prototype.convert = function (x) {
          if (x.s < 0 || x.compareTo(this.m) >= 0) {
            return x.mod(this.m);
          } else {
            return x;
          }
        };
        // Classic.prototype.revert = cRevert;
        Classic.prototype.revert = function (x) {
          return x;
        };
        // Classic.prototype.reduce = cReduce;
        Classic.prototype.reduce = function (x) {
          x.divRemTo(this.m, null, x);
        };
        // Classic.prototype.mulTo = cMulTo;
        Classic.prototype.mulTo = function (x, y, r) {
          x.multiplyTo(y, r);
          this.reduce(r);
        };
        // Classic.prototype.sqrTo = cSqrTo;
        Classic.prototype.sqrTo = function (x, r) {
          x.squareTo(r);
          this.reduce(r);
        };
        return Classic;
      })();
      //#endregion
      //#region Montgomery
      // Montgomery reduction
      var Montgomery = /** @class */ (function () {
        function Montgomery(m) {
          this.m = m;
          this.mp = m.invDigit();
          this.mpl = this.mp & 0x7fff;
          this.mph = this.mp >> 15;
          this.um = (1 << (m.DB - 15)) - 1;
          this.mt2 = 2 * m.t;
        }
        // Montgomery.prototype.convert = montConvert;
        // xR mod m
        Montgomery.prototype.convert = function (x) {
          var r = nbi();
          x.abs().dlShiftTo(this.m.t, r);
          r.divRemTo(this.m, null, r);
          if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) {
            this.m.subTo(r, r);
          }
          return r;
        };
        // Montgomery.prototype.revert = montRevert;
        // x/R mod m
        Montgomery.prototype.revert = function (x) {
          var r = nbi();
          x.copyTo(r);
          this.reduce(r);
          return r;
        };
        // Montgomery.prototype.reduce = montReduce;
        // x = x/R mod m (HAC 14.32)
        Montgomery.prototype.reduce = function (x) {
          while (x.t <= this.mt2) {
            // pad x so am has enough room later
            x[x.t++] = 0;
          }
          for (var i = 0; i < this.m.t; ++i) {
            // faster way of calculating u0 = x[i]*mp mod DV
            var j = x[i] & 0x7fff;
            var u0 =
              (j * this.mpl +
                (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) &
              x.DM;
            // use am to combine the multiply-shift-add into one call
            j = i + this.m.t;
            x[j] += this.m.am(0, u0, x, i, 0, this.m.t);
            // propagate carry
            while (x[j] >= x.DV) {
              x[j] -= x.DV;
              x[++j]++;
            }
          }
          x.clamp();
          x.drShiftTo(this.m.t, x);
          if (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
          }
        };
        // Montgomery.prototype.mulTo = montMulTo;
        // r = "xy/R mod m"; x,y != r
        Montgomery.prototype.mulTo = function (x, y, r) {
          x.multiplyTo(y, r);
          this.reduce(r);
        };
        // Montgomery.prototype.sqrTo = montSqrTo;
        // r = "x^2/R mod m"; x != r
        Montgomery.prototype.sqrTo = function (x, r) {
          x.squareTo(r);
          this.reduce(r);
        };
        return Montgomery;
      })();
      //#endregion Montgomery
      //#region Barrett
      // Barrett modular reduction
      var Barrett = /** @class */ (function () {
        function Barrett(m) {
          this.m = m;
          // setup Barrett
          this.r2 = nbi();
          this.q3 = nbi();
          BigInteger.ONE.dlShiftTo(2 * m.t, this.r2);
          this.mu = this.r2.divide(m);
        }
        // Barrett.prototype.convert = barrettConvert;
        Barrett.prototype.convert = function (x) {
          if (x.s < 0 || x.t > 2 * this.m.t) {
            return x.mod(this.m);
          } else if (x.compareTo(this.m) < 0) {
            return x;
          } else {
            var r = nbi();
            x.copyTo(r);
            this.reduce(r);
            return r;
          }
        };
        // Barrett.prototype.revert = barrettRevert;
        Barrett.prototype.revert = function (x) {
          return x;
        };
        // Barrett.prototype.reduce = barrettReduce;
        // x = x mod m (HAC 14.42)
        Barrett.prototype.reduce = function (x) {
          x.drShiftTo(this.m.t - 1, this.r2);
          if (x.t > this.m.t + 1) {
            x.t = this.m.t + 1;
            x.clamp();
          }
          this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3);
          this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2);
          while (x.compareTo(this.r2) < 0) {
            x.dAddOffset(1, this.m.t + 1);
          }
          x.subTo(this.r2, x);
          while (x.compareTo(this.m) >= 0) {
            x.subTo(this.m, x);
          }
        };
        // Barrett.prototype.mulTo = barrettMulTo;
        // r = x*y mod m; x,y != r
        Barrett.prototype.mulTo = function (x, y, r) {
          x.multiplyTo(y, r);
          this.reduce(r);
        };
        // Barrett.prototype.sqrTo = barrettSqrTo;
        // r = x^2 mod m; x != r
        Barrett.prototype.sqrTo = function (x, r) {
          x.squareTo(r);
          this.reduce(r);
        };
        return Barrett;
      })();
      //#endregion
      //#endregion REDUCERS
      // return new, unset BigInteger
      function nbi() {
        return new BigInteger(null);
      }
      function parseBigInt(str, r) {
        return new BigInteger(str, r);
      }
      // am: Compute w_j += (x*this_i), propagate carries,
      // c is initial carry, returns final carry.
      // c < 3*dvalue, x < 2*dvalue, this_i < dvalue
      // We need to select the fastest one that works in this environment.
      // am1: use a single mult and divide to get the high bits,
      // max digit bits should be 26 because
      // max internal value = 2*dvalue^2-2*dvalue (< 2^53)
      function am1(i, x, w, j, c, n) {
        while (--n >= 0) {
          var v = x * this[i++] + w[j] + c;
          c = Math.floor(v / 0x4000000);
          w[j++] = v & 0x3ffffff;
        }
        return c;
      }
      // am2 avoids a big mult-and-extract completely.
      // Max digit bits should be <= 30 because we do bitwise ops
      // on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
      function am2(i, x, w, j, c, n) {
        var xl = x & 0x7fff;
        var xh = x >> 15;
        while (--n >= 0) {
          var l = this[i] & 0x7fff;
          var h = this[i++] >> 15;
          var m = xh * l + h * xl;
          l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff);
          c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30);
          w[j++] = l & 0x3fffffff;
        }
        return c;
      }
      // Alternately, set max digit bits to 28 since some
      // browsers slow down when dealing with 32-bit numbers.
      function am3(i, x, w, j, c, n) {
        var xl = x & 0x3fff;
        var xh = x >> 14;
        while (--n >= 0) {
          var l = this[i] & 0x3fff;
          var h = this[i++] >> 14;
          var m = xh * l + h * xl;
          l = xl * l + ((m & 0x3fff) << 14) + w[j] + c;
          c = (l >> 28) + (m >> 14) + xh * h;
          w[j++] = l & 0xfffffff;
        }
        return c;
      }
      if (navigator.appName == "Microsoft Internet Explorer") {
        BigInteger.prototype.am = am2;
        dbits = 30;
      } else if (navigator.appName != "Netscape") {
        BigInteger.prototype.am = am1;
        dbits = 26;
      } else {
        // Mozilla/Netscape seems to prefer am3
        BigInteger.prototype.am = am3;
        dbits = 28;
      }
      BigInteger.prototype.DB = dbits;
      BigInteger.prototype.DM = (1 << dbits) - 1;
      BigInteger.prototype.DV = 1 << dbits;
      var BI_FP = 52;
      BigInteger.prototype.FV = Math.pow(2, BI_FP);
      BigInteger.prototype.F1 = BI_FP - dbits;
      BigInteger.prototype.F2 = 2 * dbits - BI_FP;
      // Digit conversions
      var BI_RC = [];
      var rr;
      var vv;
      rr = "0".charCodeAt(0);
      for (vv = 0; vv <= 9; ++vv) {
        BI_RC[rr++] = vv;
      }
      rr = "a".charCodeAt(0);
      for (vv = 10; vv < 36; ++vv) {
        BI_RC[rr++] = vv;
      }
      rr = "A".charCodeAt(0);
      for (vv = 10; vv < 36; ++vv) {
        BI_RC[rr++] = vv;
      }
      function intAt(s, i) {
        var c = BI_RC[s.charCodeAt(i)];
        return c == null ? -1 : c;
      }
      // return bigint initialized to value
      function nbv(i) {
        var r = nbi();
        r.fromInt(i);
        return r;
      }
      // returns bit length of the integer x
      function nbits(x) {
        var r = 1;
        var t;
        if ((t = x >>> 16) != 0) {
          x = t;
          r += 16;
        }
        if ((t = x >> 8) != 0) {
          x = t;
          r += 8;
        }
        if ((t = x >> 4) != 0) {
          x = t;
          r += 4;
        }
        if ((t = x >> 2) != 0) {
          x = t;
          r += 2;
        }
        if ((t = x >> 1) != 0) {
          x = t;
          r += 1;
        }
        return r;
      }
      // "constants"
      BigInteger.ZERO = nbv(0);
      BigInteger.ONE = nbv(1);

      // prng4.js - uses Arcfour as a PRNG
      var Arcfour = /** @class */ (function () {
        function Arcfour() {
          this.i = 0;
          this.j = 0;
          this.S = [];
        }
        // Arcfour.prototype.init = ARC4init;
        // Initialize arcfour context from key, an array of ints, each from [0..255]
        Arcfour.prototype.init = function (key) {
          var i;
          var j;
          var t;
          for (i = 0; i < 256; ++i) {
            this.S[i] = i;
          }
          j = 0;
          for (i = 0; i < 256; ++i) {
            j = (j + this.S[i] + key[i % key.length]) & 255;
            t = this.S[i];
            this.S[i] = this.S[j];
            this.S[j] = t;
          }
          this.i = 0;
          this.j = 0;
        };
        // Arcfour.prototype.next = ARC4next;
        Arcfour.prototype.next = function () {
          var t;
          this.i = (this.i + 1) & 255;
          this.j = (this.j + this.S[this.i]) & 255;
          t = this.S[this.i];
          this.S[this.i] = this.S[this.j];
          this.S[this.j] = t;
          return this.S[(t + this.S[this.i]) & 255];
        };
        return Arcfour;
      })();
      // Plug in your RNG constructor here
      function prng_newstate() {
        return new Arcfour();
      }
      // Pool size must be a multiple of 4 and greater than 32.
      // An array of bytes the size of the pool will be passed to init()
      var rng_psize = 256;

      // Random number generator - requires a PRNG backend, e.g. prng4.js
      var rng_state;
      var rng_pool = null;
      var rng_pptr;
      // Initialize the pool with junk if needed.
      if (rng_pool == null) {
        rng_pool = [];
        rng_pptr = 0;
        var t = void 0;
        if (window.crypto && window.crypto.getRandomValues) {
          // Extract entropy (2048 bits) from RNG if available
          var z = new Uint32Array(256);
          window.crypto.getRandomValues(z);
          for (t = 0; t < z.length; ++t) {
            rng_pool[rng_pptr++] = z[t] & 255;
          }
        }
        // Use mouse events for entropy, if we do not have enough entropy by the time
        // we need it, entropy will be generated by Math.random.
        var onMouseMoveListener_1 = function (ev) {
          this.count = this.count || 0;
          if (this.count >= 256 || rng_pptr >= rng_psize) {
            if (window.removeEventListener) {
              window.removeEventListener(
                "mousemove",
                onMouseMoveListener_1,
                false
              );
            } else if (window.detachEvent) {
              window.detachEvent("onmousemove", onMouseMoveListener_1);
            }
            return;
          }
          try {
            var mouseCoordinates = ev.x + ev.y;
            rng_pool[rng_pptr++] = mouseCoordinates & 255;
            this.count += 1;
          } catch (e) {
            // Sometimes Firefox will deny permission to access event properties for some reason. Ignore.
          }
        };
        if (window.addEventListener) {
          window.addEventListener("mousemove", onMouseMoveListener_1, false);
        } else if (window.attachEvent) {
          window.attachEvent("onmousemove", onMouseMoveListener_1);
        }
      }
      function rng_get_byte() {
        if (rng_state == null) {
          rng_state = prng_newstate();
          // At this point, we may not have collected enough entropy.  If not, fall back to Math.random
          while (rng_pptr < rng_psize) {
            var random = Math.floor(65536 * Math.random());
            rng_pool[rng_pptr++] = random & 255;
          }
          rng_state.init(rng_pool);
          for (rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr) {
            rng_pool[rng_pptr] = 0;
          }
          rng_pptr = 0;
        }
        // TODO: allow reseeding after first request
        return rng_state.next();
      }
      var SecureRandom = /** @class */ (function () {
        function SecureRandom() {}
        SecureRandom.prototype.nextBytes = function (ba) {
          for (var i = 0; i < ba.length; ++i) {
            ba[i] = rng_get_byte();
          }
        };
        return SecureRandom;
      })();

      // Depends on jsbn.js and rng.js
      // function linebrk(s,n) {
      //   var ret = "";
      //   var i = 0;
      //   while(i + n < s.length) {
      //     ret += s.substring(i,i+n) + "\n";
      //     i += n;
      //   }
      //   return ret + s.substring(i,s.length);
      // }
      // function byte2Hex(b) {
      //   if(b < 0x10)
      //     return "0" + b.toString(16);
      //   else
      //     return b.toString(16);
      // }
      function pkcs1pad1(s, n) {
        if (n < s.length + 22) {
          console.error("Message too long for RSA");
          return null;
        }
        var len = n - s.length - 6;
        var filler = "";
        for (var f = 0; f < len; f += 2) {
          filler += "ff";
        }
        var m = "0001" + filler + "00" + s;
        return parseBigInt(m, 16);
      }
      // PKCS#1 (type 2, random) pad input string s to n bytes, and return a bigint
      function pkcs1pad2(s, n) {
        if (n < s.length + 11) {
          // TODO: fix for utf-8
          console.error("Message too long for RSA");
          return null;
        }
        var ba = [];
        var i = s.length - 1;
        while (i >= 0 && n > 0) {
          var c = s.charCodeAt(i--);
          if (c < 128) {
            // encode using utf-8
            ba[--n] = c;
          } else if (c > 127 && c < 2048) {
            ba[--n] = (c & 63) | 128;
            ba[--n] = (c >> 6) | 192;
          } else {
            ba[--n] = (c & 63) | 128;
            ba[--n] = ((c >> 6) & 63) | 128;
            ba[--n] = (c >> 12) | 224;
          }
        }
        ba[--n] = 0;
        var rng = new SecureRandom();
        var x = [];
        while (n > 2) {
          // random non-zero pad
          x[0] = 0;
          while (x[0] == 0) {
            rng.nextBytes(x);
          }
          ba[--n] = x[0];
        }
        ba[--n] = 2;
        ba[--n] = 0;
        return new BigInteger(ba);
      }
      // "empty" RSA key constructor
      var RSAKey = /** @class */ (function () {
        function RSAKey() {
          this.n = null;
          this.e = 0;
          this.d = null;
          this.p = null;
          this.q = null;
          this.dmp1 = null;
          this.dmq1 = null;
          this.coeff = null;
        }
        //#region PROTECTED
        // protected
        // RSAKey.prototype.doPublic = RSADoPublic;
        // Perform raw public operation on "x": return x^e (mod n)
        RSAKey.prototype.doPublic = function (x) {
          return x.modPowInt(this.e, this.n);
        };
        // RSAKey.prototype.doPrivate = RSADoPrivate;
        // Perform raw private operation on "x": return x^d (mod n)
        RSAKey.prototype.doPrivate = function (x) {
          if (this.p == null || this.q == null) {
            return x.modPow(this.d, this.n);
          }
          // TODO: re-calculate any missing CRT params
          var xp = x.mod(this.p).modPow(this.dmp1, this.p);
          var xq = x.mod(this.q).modPow(this.dmq1, this.q);
          while (xp.compareTo(xq) < 0) {
            xp = xp.add(this.p);
          }
          return xp
            .subtract(xq)
            .multiply(this.coeff)
            .mod(this.p)
            .multiply(this.q)
            .add(xq);
        };
        //#endregion PROTECTED
        //#region PUBLIC
        // RSAKey.prototype.setPublic = RSASetPublic;
        // Set the public key fields N and e from hex strings
        RSAKey.prototype.setPublic = function (N, E) {
          if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
          } else {
            console.error("Invalid RSA public key");
          }
        };
        // RSAKey.prototype.encrypt = RSAEncrypt;
        // Return the PKCS#1 RSA encryption of "text" as an even-length hex string
        RSAKey.prototype.encrypt = function (text) {
          var m = pkcs1pad2(text, (this.n.bitLength() + 7) >> 3);
          if (m == null) {
            return null;
          }
          var c = this.doPublic(m);
          if (c == null) {
            return null;
          }
          var h = c.toString(16);
          if ((h.length & 1) == 0) {
            return h;
          } else {
            return "0" + h;
          }
        };
        // RSAKey.prototype.setPrivate = RSASetPrivate;
        // Set the private key fields N, e, and d from hex strings
        RSAKey.prototype.setPrivate = function (N, E, D) {
          if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
            this.d = parseBigInt(D, 16);
          } else {
            console.error("Invalid RSA private key");
          }
        };
        // RSAKey.prototype.setPrivateEx = RSASetPrivateEx;
        // Set the private key fields N, e, d and CRT params from hex strings
        RSAKey.prototype.setPrivateEx = function (N, E, D, P, Q, DP, DQ, C) {
          if (N != null && E != null && N.length > 0 && E.length > 0) {
            this.n = parseBigInt(N, 16);
            this.e = parseInt(E, 16);
            this.d = parseBigInt(D, 16);
            this.p = parseBigInt(P, 16);
            this.q = parseBigInt(Q, 16);
            this.dmp1 = parseBigInt(DP, 16);
            this.dmq1 = parseBigInt(DQ, 16);
            this.coeff = parseBigInt(C, 16);
          } else {
            console.error("Invalid RSA private key");
          }
        };
        // RSAKey.prototype.generate = RSAGenerate;
        // Generate a new random private key B bits long, using public expt E
        RSAKey.prototype.generate = function (B, E) {
          var rng = new SecureRandom();
          var qs = B >> 1;
          this.e = parseInt(E, 16);
          var ee = new BigInteger(E, 16);
          for (;;) {
            for (;;) {
              this.p = new BigInteger(B - qs, 1, rng);
              if (
                this.p
                  .subtract(BigInteger.ONE)
                  .gcd(ee)
                  .compareTo(BigInteger.ONE) == 0 &&
                this.p.isProbablePrime(10)
              ) {
                break;
              }
            }
            for (;;) {
              this.q = new BigInteger(qs, 1, rng);
              if (
                this.q
                  .subtract(BigInteger.ONE)
                  .gcd(ee)
                  .compareTo(BigInteger.ONE) == 0 &&
                this.q.isProbablePrime(10)
              ) {
                break;
              }
            }
            if (this.p.compareTo(this.q) <= 0) {
              var t = this.p;
              this.p = this.q;
              this.q = t;
            }
            var p1 = this.p.subtract(BigInteger.ONE);
            var q1 = this.q.subtract(BigInteger.ONE);
            var phi = p1.multiply(q1);
            if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
              this.n = this.p.multiply(this.q);
              this.d = ee.modInverse(phi);
              this.dmp1 = this.d.mod(p1);
              this.dmq1 = this.d.mod(q1);
              this.coeff = this.q.modInverse(this.p);
              break;
            }
          }
        };
        // RSAKey.prototype.decrypt = RSADecrypt;
        // Return the PKCS#1 RSA decryption of "ctext".
        // "ctext" is an even-length hex string and the output is a plain string.
        RSAKey.prototype.decrypt = function (ctext) {
          var c = parseBigInt(ctext, 16);
          var m = this.doPrivate(c);
          if (m == null) {
            return null;
          }
          return pkcs1unpad2(m, (this.n.bitLength() + 7) >> 3);
        };
        // Generate a new random private key B bits long, using public expt E
        RSAKey.prototype.generateAsync = function (B, E, callback) {
          var rng = new SecureRandom();
          var qs = B >> 1;
          this.e = parseInt(E, 16);
          var ee = new BigInteger(E, 16);
          var rsa = this;
          // These functions have non-descript names because they were originally for(;;) loops.
          // I don't know about cryptography to give them better names than loop1-4.
          var loop1 = function () {
            var loop4 = function () {
              if (rsa.p.compareTo(rsa.q) <= 0) {
                var t = rsa.p;
                rsa.p = rsa.q;
                rsa.q = t;
              }
              var p1 = rsa.p.subtract(BigInteger.ONE);
              var q1 = rsa.q.subtract(BigInteger.ONE);
              var phi = p1.multiply(q1);
              if (phi.gcd(ee).compareTo(BigInteger.ONE) == 0) {
                rsa.n = rsa.p.multiply(rsa.q);
                rsa.d = ee.modInverse(phi);
                rsa.dmp1 = rsa.d.mod(p1);
                rsa.dmq1 = rsa.d.mod(q1);
                rsa.coeff = rsa.q.modInverse(rsa.p);
                setTimeout(function () {
                  callback();
                }, 0); // escape
              } else {
                setTimeout(loop1, 0);
              }
            };
            var loop3 = function () {
              rsa.q = nbi();
              rsa.q.fromNumberAsync(qs, 1, rng, function () {
                rsa.q.subtract(BigInteger.ONE).gcda(ee, function (r) {
                  if (
                    r.compareTo(BigInteger.ONE) == 0 &&
                    rsa.q.isProbablePrime(10)
                  ) {
                    setTimeout(loop4, 0);
                  } else {
                    setTimeout(loop3, 0);
                  }
                });
              });
            };
            var loop2 = function () {
              rsa.p = nbi();
              rsa.p.fromNumberAsync(B - qs, 1, rng, function () {
                rsa.p.subtract(BigInteger.ONE).gcda(ee, function (r) {
                  if (
                    r.compareTo(BigInteger.ONE) == 0 &&
                    rsa.p.isProbablePrime(10)
                  ) {
                    setTimeout(loop3, 0);
                  } else {
                    setTimeout(loop2, 0);
                  }
                });
              });
            };
            setTimeout(loop2, 0);
          };
          setTimeout(loop1, 0);
        };
        RSAKey.prototype.sign = function (text, digestMethod, digestName) {
          var header = getDigestHeader(digestName);
          var digest = header + digestMethod(text).toString();
          var m = pkcs1pad1(digest, this.n.bitLength() / 4);
          if (m == null) {
            return null;
          }
          var c = this.doPrivate(m);
          if (c == null) {
            return null;
          }
          var h = c.toString(16);
          if ((h.length & 1) == 0) {
            return h;
          } else {
            return "0" + h;
          }
        };
        RSAKey.prototype.verify = function (text, signature, digestMethod) {
          var c = parseBigInt(signature, 16);
          var m = this.doPublic(c);
          if (m == null) {
            return null;
          }
          var unpadded = m.toString(16).replace(/^1f+00/, "");
          var digest = removeDigestHeader(unpadded);
          return digest == digestMethod(text).toString();
        };
        return RSAKey;
      })();
      // Undo PKCS#1 (type 2, random) padding and, if valid, return the plaintext
      function pkcs1unpad2(d, n) {
        var b = d.toByteArray();
        var i = 0;
        while (i < b.length && b[i] == 0) {
          ++i;
        }
        if (b.length - i != n - 1 || b[i] != 2) {
          return null;
        }
        ++i;
        while (b[i] != 0) {
          if (++i >= b.length) {
            return null;
          }
        }
        var ret = "";
        while (++i < b.length) {
          var c = b[i] & 255;
          if (c < 128) {
            // utf-8 decode
            ret += String.fromCharCode(c);
          } else if (c > 191 && c < 224) {
            ret += String.fromCharCode(((c & 31) << 6) | (b[i + 1] & 63));
            ++i;
          } else {
            ret += String.fromCharCode(
              ((c & 15) << 12) | ((b[i + 1] & 63) << 6) | (b[i + 2] & 63)
            );
            i += 2;
          }
        }
        return ret;
      }
      // https://tools.ietf.org/html/rfc3447#page-43
      var DIGEST_HEADERS = {
        md2: "3020300c06082a864886f70d020205000410",
        md5: "3020300c06082a864886f70d020505000410",
        sha1: "3021300906052b0e03021a05000414",
        sha224: "302d300d06096086480165030402040500041c",
        sha256: "3031300d060960864801650304020105000420",
        sha384: "3041300d060960864801650304020205000430",
        sha512: "3051300d060960864801650304020305000440",
        ripemd160: "3021300906052b2403020105000414",
      };
      function getDigestHeader(name) {
        return DIGEST_HEADERS[name] || "";
      }
      function removeDigestHeader(str) {
        for (var name_1 in DIGEST_HEADERS) {
          if (DIGEST_HEADERS.hasOwnProperty(name_1)) {
            var header = DIGEST_HEADERS[name_1];
            var len = header.length;
            if (str.substr(0, len) == header) {
              return str.substr(len);
            }
          }
        }
        return str;
      }
      // Return the PKCS#1 RSA encryption of "text" as a Base64-encoded string
      // function RSAEncryptB64(text) {
      //  var h = this.encrypt(text);
      //  if(h) return hex2b64(h); else return null;
      // }
      // public
      // RSAKey.prototype.encrypt_b64 = RSAEncryptB64;

      /*!
	Copyright (c) 2011, Yahoo! Inc. All rights reserved.
	Code licensed under the BSD License:
	http://developer.yahoo.com/yui/license.html
	version: 2.9.0
	*/
      var YAHOO = {};
      YAHOO.lang = {
        /**
         * Utility to set up the prototype, constructor and superclass properties to
         * support an inheritance strategy that can chain constructors and methods.
         * Static members will not be inherited.
         *
         * @method extend
         * @static
         * @param {Function} subc   the object to modify
         * @param {Function} superc the object to inherit
         * @param {Object} overrides  additional properties/methods to add to the
         *                              subclass prototype.  These will override the
         *                              matching items obtained from the superclass
         *                              if present.
         */
        extend: function (subc, superc, overrides) {
          if (!superc || !subc) {
            throw new Error(
              "YAHOO.lang.extend failed, please check that " +
                "all dependencies are included."
            );
          }

          var F = function () {};
          F.prototype = superc.prototype;
          subc.prototype = new F();
          subc.prototype.constructor = subc;
          subc.superclass = superc.prototype;

          if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor = superc;
          }

          if (overrides) {
            var i;
            for (i in overrides) {
              subc.prototype[i] = overrides[i];
            }

            /*
             * IE will not enumerate native functions in a derived object even if the
             * function was overridden.  This is a workaround for specific functions
             * we care about on the Object prototype.
             * @property _IEEnumFix
             * @param {Function} r  the object to receive the augmentation
             * @param {Function} s  the object that supplies the properties to augment
             * @static
             * @private
             */
            var _IEEnumFix = function () {},
              ADD = ["toString", "valueOf"];
            try {
              if (/MSIE/.test(navigator.userAgent)) {
                _IEEnumFix = function (r, s) {
                  for (i = 0; i < ADD.length; i = i + 1) {
                    var fname = ADD[i],
                      f = s[fname];
                    if (
                      typeof f === "function" &&
                      f != Object.prototype[fname]
                    ) {
                      r[fname] = f;
                    }
                  }
                };
              }
            } catch (ex) {}
            _IEEnumFix(subc.prototype, overrides);
          }
        },
      };

      /* asn1-1.0.13.js (c) 2013-2017 Kenji Urushima | kjur.github.com/jsrsasign/license
       */

      /**
       * @fileOverview
       * @name asn1-1.0.js
       * @author Kenji Urushima kenji.urushima@gmail.com
       * @version asn1 1.0.13 (2017-Jun-02)
       * @since jsrsasign 2.1
       * @license <a href="https://kjur.github.io/jsrsasign/license/">MIT License</a>
       */

      /**
       * kjur's class library name space
       * <p>
       * This name space provides following name spaces:
       * <ul>
       * <li>{@link KJUR.asn1} - ASN.1 primitive hexadecimal encoder</li>
       * <li>{@link KJUR.asn1.x509} - ASN.1 structure for X.509 certificate and CRL</li>
       * <li>{@link KJUR.crypto} - Java Cryptographic Extension(JCE) style MessageDigest/Signature
       * class and utilities</li>
       * </ul>
       * </p>
       * NOTE: Please ignore method summary and document of this namespace. This caused by a bug of jsdoc2.
       * @name KJUR
       * @namespace kjur's class library name space
       */
      var KJUR = {};

      /**
       * kjur's ASN.1 class library name space
       * <p>
       * This is ITU-T X.690 ASN.1 DER encoder class library and
       * class structure and methods is very similar to
       * org.bouncycastle.asn1 package of
       * well known BouncyCaslte Cryptography Library.
       * <h4>PROVIDING ASN.1 PRIMITIVES</h4>
       * Here are ASN.1 DER primitive classes.
       * <ul>
       * <li>0x01 {@link KJUR.asn1.DERBoolean}</li>
       * <li>0x02 {@link KJUR.asn1.DERInteger}</li>
       * <li>0x03 {@link KJUR.asn1.DERBitString}</li>
       * <li>0x04 {@link KJUR.asn1.DEROctetString}</li>
       * <li>0x05 {@link KJUR.asn1.DERNull}</li>
       * <li>0x06 {@link KJUR.asn1.DERObjectIdentifier}</li>
       * <li>0x0a {@link KJUR.asn1.DEREnumerated}</li>
       * <li>0x0c {@link KJUR.asn1.DERUTF8String}</li>
       * <li>0x12 {@link KJUR.asn1.DERNumericString}</li>
       * <li>0x13 {@link KJUR.asn1.DERPrintableString}</li>
       * <li>0x14 {@link KJUR.asn1.DERTeletexString}</li>
       * <li>0x16 {@link KJUR.asn1.DERIA5String}</li>
       * <li>0x17 {@link KJUR.asn1.DERUTCTime}</li>
       * <li>0x18 {@link KJUR.asn1.DERGeneralizedTime}</li>
       * <li>0x30 {@link KJUR.asn1.DERSequence}</li>
       * <li>0x31 {@link KJUR.asn1.DERSet}</li>
       * </ul>
       * <h4>OTHER ASN.1 CLASSES</h4>
       * <ul>
       * <li>{@link KJUR.asn1.ASN1Object}</li>
       * <li>{@link KJUR.asn1.DERAbstractString}</li>
       * <li>{@link KJUR.asn1.DERAbstractTime}</li>
       * <li>{@link KJUR.asn1.DERAbstractStructured}</li>
       * <li>{@link KJUR.asn1.DERTaggedObject}</li>
       * </ul>
       * <h4>SUB NAME SPACES</h4>
       * <ul>
       * <li>{@link KJUR.asn1.cades} - CAdES long term signature format</li>
       * <li>{@link KJUR.asn1.cms} - Cryptographic Message Syntax</li>
       * <li>{@link KJUR.asn1.csr} - Certificate Signing Request (CSR/PKCS#10)</li>
       * <li>{@link KJUR.asn1.tsp} - RFC 3161 Timestamping Protocol Format</li>
       * <li>{@link KJUR.asn1.x509} - RFC 5280 X.509 certificate and CRL</li>
       * </ul>
       * </p>
       * NOTE: Please ignore method summary and document of this namespace.
       * This caused by a bug of jsdoc2.
       * @name KJUR.asn1
       * @namespace
       */
      if (typeof KJUR.asn1 == "undefined" || !KJUR.asn1) KJUR.asn1 = {};

      /**
       * ASN1 utilities class
       * @name KJUR.asn1.ASN1Util
       * @class ASN1 utilities class
       * @since asn1 1.0.2
       */
      KJUR.asn1.ASN1Util = new (function () {
        this.integerToByteHex = function (i) {
          var h = i.toString(16);
          if (h.length % 2 == 1) h = "0" + h;
          return h;
        };
        this.bigIntToMinTwosComplementsHex = function (bigIntegerValue) {
          var h = bigIntegerValue.toString(16);
          if (h.substr(0, 1) != "-") {
            if (h.length % 2 == 1) {
              h = "0" + h;
            } else {
              if (!h.match(/^[0-7]/)) {
                h = "00" + h;
              }
            }
          } else {
            var hPos = h.substr(1);
            var xorLen = hPos.length;
            if (xorLen % 2 == 1) {
              xorLen += 1;
            } else {
              if (!h.match(/^[0-7]/)) {
                xorLen += 2;
              }
            }
            var hMask = "";
            for (var i = 0; i < xorLen; i++) {
              hMask += "f";
            }
            var biMask = new BigInteger(hMask, 16);
            var biNeg = biMask.xor(bigIntegerValue).add(BigInteger.ONE);
            h = biNeg.toString(16).replace(/^-/, "");
          }
          return h;
        };
        /**
         * get PEM string from hexadecimal data and header string
         * @name getPEMStringFromHex
         * @memberOf KJUR.asn1.ASN1Util
         * @function
         * @param {String} dataHex hexadecimal string of PEM body
         * @param {String} pemHeader PEM header string (ex. 'RSA PRIVATE KEY')
         * @return {String} PEM formatted string of input data
         * @description
         * This method converts a hexadecimal string to a PEM string with
         * a specified header. Its line break will be CRLF("\r\n").
         * @example
         * var pem  = KJUR.asn1.ASN1Util.getPEMStringFromHex('616161', 'RSA PRIVATE KEY');
         * // value of pem will be:
         * -----BEGIN PRIVATE KEY-----
         * YWFh
         * -----END PRIVATE KEY-----
         */
        this.getPEMStringFromHex = function (dataHex, pemHeader) {
          return hextopem(dataHex, pemHeader);
        };

        /**
         * generate ASN1Object specifed by JSON parameters
         * @name newObject
         * @memberOf KJUR.asn1.ASN1Util
         * @function
         * @param {Array} param JSON parameter to generate ASN1Object
         * @return {KJUR.asn1.ASN1Object} generated object
         * @since asn1 1.0.3
         * @description
         * generate any ASN1Object specified by JSON param
         * including ASN.1 primitive or structured.
         * Generally 'param' can be described as follows:
         * <blockquote>
         * {TYPE-OF-ASNOBJ: ASN1OBJ-PARAMETER}
         * </blockquote>
         * 'TYPE-OF-ASN1OBJ' can be one of following symbols:
         * <ul>
         * <li>'bool' - DERBoolean</li>
         * <li>'int' - DERInteger</li>
         * <li>'bitstr' - DERBitString</li>
         * <li>'octstr' - DEROctetString</li>
         * <li>'null' - DERNull</li>
         * <li>'oid' - DERObjectIdentifier</li>
         * <li>'enum' - DEREnumerated</li>
         * <li>'utf8str' - DERUTF8String</li>
         * <li>'numstr' - DERNumericString</li>
         * <li>'prnstr' - DERPrintableString</li>
         * <li>'telstr' - DERTeletexString</li>
         * <li>'ia5str' - DERIA5String</li>
         * <li>'utctime' - DERUTCTime</li>
         * <li>'gentime' - DERGeneralizedTime</li>
         * <li>'seq' - DERSequence</li>
         * <li>'set' - DERSet</li>
         * <li>'tag' - DERTaggedObject</li>
         * </ul>
         * @example
         * newObject({'prnstr': 'aaa'});
         * newObject({'seq': [{'int': 3}, {'prnstr': 'aaa'}]})
         * // ASN.1 Tagged Object
         * newObject({'tag': {'tag': 'a1',
         *                    'explicit': true,
         *                    'obj': {'seq': [{'int': 3}, {'prnstr': 'aaa'}]}}});
         * // more simple representation of ASN.1 Tagged Object
         * newObject({'tag': ['a1',
         *                    true,
         *                    {'seq': [
         *                      {'int': 3},
         *                      {'prnstr': 'aaa'}]}
         *                   ]});
         */
        this.newObject = function (param) {
          var _KJUR = KJUR,
            _KJUR_asn1 = _KJUR.asn1,
            _DERBoolean = _KJUR_asn1.DERBoolean,
            _DERInteger = _KJUR_asn1.DERInteger,
            _DERBitString = _KJUR_asn1.DERBitString,
            _DEROctetString = _KJUR_asn1.DEROctetString,
            _DERNull = _KJUR_asn1.DERNull,
            _DERObjectIdentifier = _KJUR_asn1.DERObjectIdentifier,
            _DEREnumerated = _KJUR_asn1.DEREnumerated,
            _DERUTF8String = _KJUR_asn1.DERUTF8String,
            _DERNumericString = _KJUR_asn1.DERNumericString,
            _DERPrintableString = _KJUR_asn1.DERPrintableString,
            _DERTeletexString = _KJUR_asn1.DERTeletexString,
            _DERIA5String = _KJUR_asn1.DERIA5String,
            _DERUTCTime = _KJUR_asn1.DERUTCTime,
            _DERGeneralizedTime = _KJUR_asn1.DERGeneralizedTime,
            _DERSequence = _KJUR_asn1.DERSequence,
            _DERSet = _KJUR_asn1.DERSet,
            _DERTaggedObject = _KJUR_asn1.DERTaggedObject,
            _newObject = _KJUR_asn1.ASN1Util.newObject;

          var keys = Object.keys(param);
          if (keys.length != 1) throw "key of param shall be only one.";
          var key = keys[0];

          if (
            ":bool:int:bitstr:octstr:null:oid:enum:utf8str:numstr:prnstr:telstr:ia5str:utctime:gentime:seq:set:tag:".indexOf(
              ":" + key + ":"
            ) == -1
          )
            throw "undefined key: " + key;

          if (key == "bool") return new _DERBoolean(param[key]);
          if (key == "int") return new _DERInteger(param[key]);
          if (key == "bitstr") return new _DERBitString(param[key]);
          if (key == "octstr") return new _DEROctetString(param[key]);
          if (key == "null") return new _DERNull(param[key]);
          if (key == "oid") return new _DERObjectIdentifier(param[key]);
          if (key == "enum") return new _DEREnumerated(param[key]);
          if (key == "utf8str") return new _DERUTF8String(param[key]);
          if (key == "numstr") return new _DERNumericString(param[key]);
          if (key == "prnstr") return new _DERPrintableString(param[key]);
          if (key == "telstr") return new _DERTeletexString(param[key]);
          if (key == "ia5str") return new _DERIA5String(param[key]);
          if (key == "utctime") return new _DERUTCTime(param[key]);
          if (key == "gentime") return new _DERGeneralizedTime(param[key]);

          if (key == "seq") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
              var asn1Obj = _newObject(paramList[i]);
              a.push(asn1Obj);
            }
            return new _DERSequence({ array: a });
          }

          if (key == "set") {
            var paramList = param[key];
            var a = [];
            for (var i = 0; i < paramList.length; i++) {
              var asn1Obj = _newObject(paramList[i]);
              a.push(asn1Obj);
            }
            return new _DERSet({ array: a });
          }

          if (key == "tag") {
            var tagParam = param[key];
            if (
              Object.prototype.toString.call(tagParam) === "[object Array]" &&
              tagParam.length == 3
            ) {
              var obj = _newObject(tagParam[2]);
              return new _DERTaggedObject({
                tag: tagParam[0],
                explicit: tagParam[1],
                obj: obj,
              });
            } else {
              var newParam = {};
              if (tagParam.explicit !== undefined)
                newParam.explicit = tagParam.explicit;
              if (tagParam.tag !== undefined) newParam.tag = tagParam.tag;
              if (tagParam.obj === undefined)
                throw "obj shall be specified for 'tag'.";
              newParam.obj = _newObject(tagParam.obj);
              return new _DERTaggedObject(newParam);
            }
          }
        };

        /**
         * get encoded hexadecimal string of ASN1Object specifed by JSON parameters
         * @name jsonToASN1HEX
         * @memberOf KJUR.asn1.ASN1Util
         * @function
         * @param {Array} param JSON parameter to generate ASN1Object
         * @return hexadecimal string of ASN1Object
         * @since asn1 1.0.4
         * @description
         * As for ASN.1 object representation of JSON object,
         * please see {@link newObject}.
         * @example
         * jsonToASN1HEX({'prnstr': 'aaa'});
         */
        this.jsonToASN1HEX = function (param) {
          var asn1Obj = this.newObject(param);
          return asn1Obj.getEncodedHex();
        };
      })();

      /**
       * get dot noted oid number string from hexadecimal value of OID
       * @name oidHexToInt
       * @memberOf KJUR.asn1.ASN1Util
       * @function
       * @param {String} hex hexadecimal value of object identifier
       * @return {String} dot noted string of object identifier
       * @since jsrsasign 4.8.3 asn1 1.0.7
       * @description
       * This static method converts from hexadecimal string representation of
       * ASN.1 value of object identifier to oid number string.
       * @example
       * KJUR.asn1.ASN1Util.oidHexToInt('550406') &rarr; "2.5.4.6"
       */
      KJUR.asn1.ASN1Util.oidHexToInt = function (hex) {
        var s = "";
        var i01 = parseInt(hex.substr(0, 2), 16);
        var i0 = Math.floor(i01 / 40);
        var i1 = i01 % 40;
        var s = i0 + "." + i1;

        var binbuf = "";
        for (var i = 2; i < hex.length; i += 2) {
          var value = parseInt(hex.substr(i, 2), 16);
          var bin = ("00000000" + value.toString(2)).slice(-8);
          binbuf = binbuf + bin.substr(1, 7);
          if (bin.substr(0, 1) == "0") {
            var bi = new BigInteger(binbuf, 2);
            s = s + "." + bi.toString(10);
            binbuf = "";
          }
        }
        return s;
      };

      /**
       * get hexadecimal value of object identifier from dot noted oid value
       * @name oidIntToHex
       * @memberOf KJUR.asn1.ASN1Util
       * @function
       * @param {String} oidString dot noted string of object identifier
       * @return {String} hexadecimal value of object identifier
       * @since jsrsasign 4.8.3 asn1 1.0.7
       * @description
       * This static method converts from object identifier value string.
       * to hexadecimal string representation of it.
       * @example
       * KJUR.asn1.ASN1Util.oidIntToHex("2.5.4.6") &rarr; "550406"
       */
      KJUR.asn1.ASN1Util.oidIntToHex = function (oidString) {
        var itox = function (i) {
          var h = i.toString(16);
          if (h.length == 1) h = "0" + h;
          return h;
        };

        var roidtox = function (roid) {
          var h = "";
          var bi = new BigInteger(roid, 10);
          var b = bi.toString(2);
          var padLen = 7 - (b.length % 7);
          if (padLen == 7) padLen = 0;
          var bPad = "";
          for (var i = 0; i < padLen; i++) bPad += "0";
          b = bPad + b;
          for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7) b8 = "1" + b8;
            h += itox(parseInt(b8, 2));
          }
          return h;
        };

        if (!oidString.match(/^[0-9.]+$/)) {
          throw "malformed oid string: " + oidString;
        }
        var h = "";
        var a = oidString.split(".");
        var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
        h += itox(i0);
        a.splice(0, 2);
        for (var i = 0; i < a.length; i++) {
          h += roidtox(a[i]);
        }
        return h;
      };

      // ********************************************************************
      //  Abstract ASN.1 Classes
      // ********************************************************************

      // ********************************************************************

      /**
       * base class for ASN.1 DER encoder object
       * @name KJUR.asn1.ASN1Object
       * @class base class for ASN.1 DER encoder object
       * @property {Boolean} isModified flag whether internal data was changed
       * @property {String} hTLV hexadecimal string of ASN.1 TLV
       * @property {String} hT hexadecimal string of ASN.1 TLV tag(T)
       * @property {String} hL hexadecimal string of ASN.1 TLV length(L)
       * @property {String} hV hexadecimal string of ASN.1 TLV value(V)
       * @description
       */
      KJUR.asn1.ASN1Object = function () {
        var hV = "";

        /**
         * get hexadecimal ASN.1 TLV length(L) bytes from TLV value(V)
         * @name getLengthHexFromValue
         * @memberOf KJUR.asn1.ASN1Object#
         * @function
         * @return {String} hexadecimal string of ASN.1 TLV length(L)
         */
        this.getLengthHexFromValue = function () {
          if (typeof this.hV == "undefined" || this.hV == null) {
            throw "this.hV is null or undefined.";
          }
          if (this.hV.length % 2 == 1) {
            throw (
              "value hex must be even length: n=" + hV.length + ",v=" + this.hV
            );
          }
          var n = this.hV.length / 2;
          var hN = n.toString(16);
          if (hN.length % 2 == 1) {
            hN = "0" + hN;
          }
          if (n < 128) {
            return hN;
          } else {
            var hNlen = hN.length / 2;
            if (hNlen > 15) {
              throw (
                "ASN.1 length too long to represent by 8x: n = " +
                n.toString(16)
              );
            }
            var head = 128 + hNlen;
            return head.toString(16) + hN;
          }
        };

        /**
         * get hexadecimal string of ASN.1 TLV bytes
         * @name getEncodedHex
         * @memberOf KJUR.asn1.ASN1Object#
         * @function
         * @return {String} hexadecimal string of ASN.1 TLV
         */
        this.getEncodedHex = function () {
          if (this.hTLV == null || this.isModified) {
            this.hV = this.getFreshValueHex();
            this.hL = this.getLengthHexFromValue();
            this.hTLV = this.hT + this.hL + this.hV;
            this.isModified = false;
            //alert("first time: " + this.hTLV);
          }
          return this.hTLV;
        };

        /**
         * get hexadecimal string of ASN.1 TLV value(V) bytes
         * @name getValueHex
         * @memberOf KJUR.asn1.ASN1Object#
         * @function
         * @return {String} hexadecimal string of ASN.1 TLV value(V) bytes
         */
        this.getValueHex = function () {
          this.getEncodedHex();
          return this.hV;
        };

        this.getFreshValueHex = function () {
          return "";
        };
      };

      // == BEGIN DERAbstractString ================================================
      /**
       * base class for ASN.1 DER string classes
       * @name KJUR.asn1.DERAbstractString
       * @class base class for ASN.1 DER string classes
       * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
       * @property {String} s internal string of value
       * @extends KJUR.asn1.ASN1Object
       * @description
       * <br/>
       * As for argument 'params' for constructor, you can specify one of
       * following properties:
       * <ul>
       * <li>str - specify initial ASN.1 value(V) by a string</li>
       * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
       * </ul>
       * NOTE: 'params' can be omitted.
       */
      KJUR.asn1.DERAbstractString = function (params) {
        KJUR.asn1.DERAbstractString.superclass.constructor.call(this);

        /**
         * get string value of this string object
         * @name getString
         * @memberOf KJUR.asn1.DERAbstractString#
         * @function
         * @return {String} string value of this string object
         */
        this.getString = function () {
          return this.s;
        };

        /**
         * set value by a string
         * @name setString
         * @memberOf KJUR.asn1.DERAbstractString#
         * @function
         * @param {String} newS value by a string to set
         */
        this.setString = function (newS) {
          this.hTLV = null;
          this.isModified = true;
          this.s = newS;
          this.hV = stohex(this.s);
        };

        /**
         * set value by a hexadecimal string
         * @name setStringHex
         * @memberOf KJUR.asn1.DERAbstractString#
         * @function
         * @param {String} newHexString value by a hexadecimal string to set
         */
        this.setStringHex = function (newHexString) {
          this.hTLV = null;
          this.isModified = true;
          this.s = null;
          this.hV = newHexString;
        };

        this.getFreshValueHex = function () {
          return this.hV;
        };

        if (typeof params != "undefined") {
          if (typeof params == "string") {
            this.setString(params);
          } else if (typeof params["str"] != "undefined") {
            this.setString(params["str"]);
          } else if (typeof params["hex"] != "undefined") {
            this.setStringHex(params["hex"]);
          }
        }
      };
      YAHOO.lang.extend(KJUR.asn1.DERAbstractString, KJUR.asn1.ASN1Object);
      // == END   DERAbstractString ================================================

      // == BEGIN DERAbstractTime ==================================================
      /**
       * base class for ASN.1 DER Generalized/UTCTime class
       * @name KJUR.asn1.DERAbstractTime
       * @class base class for ASN.1 DER Generalized/UTCTime class
       * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
       * @extends KJUR.asn1.ASN1Object
       * @description
       * @see KJUR.asn1.ASN1Object - superclass
       */
      KJUR.asn1.DERAbstractTime = function (params) {
        KJUR.asn1.DERAbstractTime.superclass.constructor.call(this);

        // --- PRIVATE METHODS --------------------
        this.localDateToUTC = function (d) {
          utc = d.getTime() + d.getTimezoneOffset() * 60000;
          var utcDate = new Date(utc);
          return utcDate;
        };

        /*
         * format date string by Data object
         * @name formatDate
         * @memberOf KJUR.asn1.AbstractTime;
         * @param {Date} dateObject
         * @param {string} type 'utc' or 'gen'
         * @param {boolean} withMillis flag for with millisections or not
         * @description
         * 'withMillis' flag is supported from asn1 1.0.6.
         */
        this.formatDate = function (dateObject, type, withMillis) {
          var pad = this.zeroPadding;
          var d = this.localDateToUTC(dateObject);
          var year = String(d.getFullYear());
          if (type == "utc") year = year.substr(2, 2);
          var month = pad(String(d.getMonth() + 1), 2);
          var day = pad(String(d.getDate()), 2);
          var hour = pad(String(d.getHours()), 2);
          var min = pad(String(d.getMinutes()), 2);
          var sec = pad(String(d.getSeconds()), 2);
          var s = year + month + day + hour + min + sec;
          if (withMillis === true) {
            var millis = d.getMilliseconds();
            if (millis != 0) {
              var sMillis = pad(String(millis), 3);
              sMillis = sMillis.replace(/[0]+$/, "");
              s = s + "." + sMillis;
            }
          }
          return s + "Z";
        };

        this.zeroPadding = function (s, len) {
          if (s.length >= len) return s;
          return new Array(len - s.length + 1).join("0") + s;
        };

        // --- PUBLIC METHODS --------------------
        /**
         * get string value of this string object
         * @name getString
         * @memberOf KJUR.asn1.DERAbstractTime#
         * @function
         * @return {String} string value of this time object
         */
        this.getString = function () {
          return this.s;
        };

        /**
         * set value by a string
         * @name setString
         * @memberOf KJUR.asn1.DERAbstractTime#
         * @function
         * @param {String} newS value by a string to set such like "130430235959Z"
         */
        this.setString = function (newS) {
          this.hTLV = null;
          this.isModified = true;
          this.s = newS;
          this.hV = stohex(newS);
        };

        /**
         * set value by a Date object
         * @name setByDateValue
         * @memberOf KJUR.asn1.DERAbstractTime#
         * @function
         * @param {Integer} year year of date (ex. 2013)
         * @param {Integer} month month of date between 1 and 12 (ex. 12)
         * @param {Integer} day day of month
         * @param {Integer} hour hours of date
         * @param {Integer} min minutes of date
         * @param {Integer} sec seconds of date
         */
        this.setByDateValue = function (year, month, day, hour, min, sec) {
          var dateObject = new Date(
            Date.UTC(year, month - 1, day, hour, min, sec, 0)
          );
          this.setByDate(dateObject);
        };

        this.getFreshValueHex = function () {
          return this.hV;
        };
      };
      YAHOO.lang.extend(KJUR.asn1.DERAbstractTime, KJUR.asn1.ASN1Object);
      // == END   DERAbstractTime ==================================================

      // == BEGIN DERAbstractStructured ============================================
      /**
       * base class for ASN.1 DER structured class
       * @name KJUR.asn1.DERAbstractStructured
       * @class base class for ASN.1 DER structured class
       * @property {Array} asn1Array internal array of ASN1Object
       * @extends KJUR.asn1.ASN1Object
       * @description
       * @see KJUR.asn1.ASN1Object - superclass
       */
      KJUR.asn1.DERAbstractStructured = function (params) {
        KJUR.asn1.DERAbstractString.superclass.constructor.call(this);

        /**
         * set value by array of ASN1Object
         * @name setByASN1ObjectArray
         * @memberOf KJUR.asn1.DERAbstractStructured#
         * @function
         * @param {array} asn1ObjectArray array of ASN1Object to set
         */
        this.setByASN1ObjectArray = function (asn1ObjectArray) {
          this.hTLV = null;
          this.isModified = true;
          this.asn1Array = asn1ObjectArray;
        };

        /**
         * append an ASN1Object to internal array
         * @name appendASN1Object
         * @memberOf KJUR.asn1.DERAbstractStructured#
         * @function
         * @param {ASN1Object} asn1Object to add
         */
        this.appendASN1Object = function (asn1Object) {
          this.hTLV = null;
          this.isModified = true;
          this.asn1Array.push(asn1Object);
        };

        this.asn1Array = new Array();
        if (typeof params != "undefined") {
          if (typeof params["array"] != "undefined") {
            this.asn1Array = params["array"];
          }
        }
      };
      YAHOO.lang.extend(KJUR.asn1.DERAbstractStructured, KJUR.asn1.ASN1Object);

      // ********************************************************************
      //  ASN.1 Object Classes
      // ********************************************************************

      // ********************************************************************
      /**
       * class for ASN.1 DER Boolean
       * @name KJUR.asn1.DERBoolean
       * @class class for ASN.1 DER Boolean
       * @extends KJUR.asn1.ASN1Object
       * @description
       * @see KJUR.asn1.ASN1Object - superclass
       */
      KJUR.asn1.DERBoolean = function () {
        KJUR.asn1.DERBoolean.superclass.constructor.call(this);
        this.hT = "01";
        this.hTLV = "0101ff";
      };
      YAHOO.lang.extend(KJUR.asn1.DERBoolean, KJUR.asn1.ASN1Object);

      // ********************************************************************
      /**
       * class for ASN.1 DER Integer
       * @name KJUR.asn1.DERInteger
       * @class class for ASN.1 DER Integer
       * @extends KJUR.asn1.ASN1Object
       * @description
       * <br/>
       * As for argument 'params' for constructor, you can specify one of
       * following properties:
       * <ul>
       * <li>int - specify initial ASN.1 value(V) by integer value</li>
       * <li>bigint - specify initial ASN.1 value(V) by BigInteger object</li>
       * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
       * </ul>
       * NOTE: 'params' can be omitted.
       */
      KJUR.asn1.DERInteger = function (params) {
        KJUR.asn1.DERInteger.superclass.constructor.call(this);
        this.hT = "02";

        /**
         * set value by Tom Wu's BigInteger object
         * @name setByBigInteger
         * @memberOf KJUR.asn1.DERInteger#
         * @function
         * @param {BigInteger} bigIntegerValue to set
         */
        this.setByBigInteger = function (bigIntegerValue) {
          this.hTLV = null;
          this.isModified = true;
          this.hV =
            KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
        };

        /**
         * set value by integer value
         * @name setByInteger
         * @memberOf KJUR.asn1.DERInteger
         * @function
         * @param {Integer} integer value to set
         */
        this.setByInteger = function (intValue) {
          var bi = new BigInteger(String(intValue), 10);
          this.setByBigInteger(bi);
        };

        /**
         * set value by integer value
         * @name setValueHex
         * @memberOf KJUR.asn1.DERInteger#
         * @function
         * @param {String} hexadecimal string of integer value
         * @description
         * <br/>
         * NOTE: Value shall be represented by minimum octet length of
         * two's complement representation.
         * @example
         * new KJUR.asn1.DERInteger(123);
         * new KJUR.asn1.DERInteger({'int': 123});
         * new KJUR.asn1.DERInteger({'hex': '1fad'});
         */
        this.setValueHex = function (newHexString) {
          this.hV = newHexString;
        };

        this.getFreshValueHex = function () {
          return this.hV;
        };

        if (typeof params != "undefined") {
          if (typeof params["bigint"] != "undefined") {
            this.setByBigInteger(params["bigint"]);
          } else if (typeof params["int"] != "undefined") {
            this.setByInteger(params["int"]);
          } else if (typeof params == "number") {
            this.setByInteger(params);
          } else if (typeof params["hex"] != "undefined") {
            this.setValueHex(params["hex"]);
          }
        }
      };
      YAHOO.lang.extend(KJUR.asn1.DERInteger, KJUR.asn1.ASN1Object);

      // ********************************************************************
      /**
       * class for ASN.1 DER encoded BitString primitive
       * @name KJUR.asn1.DERBitString
       * @class class for ASN.1 DER encoded BitString primitive
       * @extends KJUR.asn1.ASN1Object
       * @description
       * <br/>
       * As for argument 'params' for constructor, you can specify one of
       * following properties:
       * <ul>
       * <li>bin - specify binary string (ex. '10111')</li>
       * <li>array - specify array of boolean (ex. [true,false,true,true])</li>
       * <li>hex - specify hexadecimal string of ASN.1 value(V) including unused bits</li>
       * <li>obj - specify {@link KJUR.asn1.ASN1Util.newObject}
       * argument for "BitString encapsulates" structure.</li>
       * </ul>
       * NOTE1: 'params' can be omitted.<br/>
       * NOTE2: 'obj' parameter have been supported since
       * asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).<br/>
       * @example
       * // default constructor
       * o = new KJUR.asn1.DERBitString();
       * // initialize with binary string
       * o = new KJUR.asn1.DERBitString({bin: "1011"});
       * // initialize with boolean array
       * o = new KJUR.asn1.DERBitString({array: [true,false,true,true]});
       * // initialize with hexadecimal string (04 is unused bits)
       * o = new KJUR.asn1.DEROctetString({hex: "04bac0"});
       * // initialize with ASN1Util.newObject argument for encapsulated
       * o = new KJUR.asn1.DERBitString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
       * // above generates a ASN.1 data like this:
       * // BIT STRING, encapsulates {
       * //   SEQUENCE {
       * //     INTEGER 3
       * //     PrintableString 'aaa'
       * //     }
       * //   }
       */
      KJUR.asn1.DERBitString = function (params) {
        if (params !== undefined && typeof params.obj !== "undefined") {
          var o = KJUR.asn1.ASN1Util.newObject(params.obj);
          params.hex = "00" + o.getEncodedHex();
        }
        KJUR.asn1.DERBitString.superclass.constructor.call(this);
        this.hT = "03";

        /**
         * set ASN.1 value(V) by a hexadecimal string including unused bits
         * @name setHexValueIncludingUnusedBits
         * @memberOf KJUR.asn1.DERBitString#
         * @function
         * @param {String} newHexStringIncludingUnusedBits
         */
        this.setHexValueIncludingUnusedBits = function (
          newHexStringIncludingUnusedBits
        ) {
          this.hTLV = null;
          this.isModified = true;
          this.hV = newHexStringIncludingUnusedBits;
        };

        /**
         * set ASN.1 value(V) by unused bit and hexadecimal string of value
         * @name setUnusedBitsAndHexValue
         * @memberOf KJUR.asn1.DERBitString#
         * @function
         * @param {Integer} unusedBits
         * @param {String} hValue
         */
        this.setUnusedBitsAndHexValue = function (unusedBits, hValue) {
          if (unusedBits < 0 || 7 < unusedBits) {
            throw "unused bits shall be from 0 to 7: u = " + unusedBits;
          }
          var hUnusedBits = "0" + unusedBits;
          this.hTLV = null;
          this.isModified = true;
          this.hV = hUnusedBits + hValue;
        };

        /**
         * set ASN.1 DER BitString by binary string<br/>
         * @name setByBinaryString
         * @memberOf KJUR.asn1.DERBitString#
         * @function
         * @param {String} binaryString binary value string (i.e. '10111')
         * @description
         * Its unused bits will be calculated automatically by length of
         * 'binaryValue'. <br/>
         * NOTE: Trailing zeros '0' will be ignored.
         * @example
         * o = new KJUR.asn1.DERBitString();
         * o.setByBooleanArray("01011");
         */
        this.setByBinaryString = function (binaryString) {
          binaryString = binaryString.replace(/0+$/, "");
          var unusedBits = 8 - (binaryString.length % 8);
          if (unusedBits == 8) unusedBits = 0;
          for (var i = 0; i <= unusedBits; i++) {
            binaryString += "0";
          }
          var h = "";
          for (var i = 0; i < binaryString.length - 1; i += 8) {
            var b = binaryString.substr(i, 8);
            var x = parseInt(b, 2).toString(16);
            if (x.length == 1) x = "0" + x;
            h += x;
          }
          this.hTLV = null;
          this.isModified = true;
          this.hV = "0" + unusedBits + h;
        };

        /**
         * set ASN.1 TLV value(V) by an array of boolean<br/>
         * @name setByBooleanArray
         * @memberOf KJUR.asn1.DERBitString#
         * @function
         * @param {array} booleanArray array of boolean (ex. [true, false, true])
         * @description
         * NOTE: Trailing falses will be ignored in the ASN.1 DER Object.
         * @example
         * o = new KJUR.asn1.DERBitString();
         * o.setByBooleanArray([false, true, false, true, true]);
         */
        this.setByBooleanArray = function (booleanArray) {
          var s = "";
          for (var i = 0; i < booleanArray.length; i++) {
            if (booleanArray[i] == true) {
              s += "1";
            } else {
              s += "0";
            }
          }
          this.setByBinaryString(s);
        };

        /**
         * generate an array of falses with specified length<br/>
         * @name newFalseArray
         * @memberOf KJUR.asn1.DERBitString
         * @function
         * @param {Integer} nLength length of array to generate
         * @return {array} array of boolean falses
         * @description
         * This static method may be useful to initialize boolean array.
         * @example
         * o = new KJUR.asn1.DERBitString();
         * o.newFalseArray(3) &rarr; [false, false, false]
         */
        this.newFalseArray = function (nLength) {
          var a = new Array(nLength);
          for (var i = 0; i < nLength; i++) {
            a[i] = false;
          }
          return a;
        };

        this.getFreshValueHex = function () {
          return this.hV;
        };

        if (typeof params != "undefined") {
          if (
            typeof params == "string" &&
            params.toLowerCase().match(/^[0-9a-f]+$/)
          ) {
            this.setHexValueIncludingUnusedBits(params);
          } else if (typeof params["hex"] != "undefined") {
            this.setHexValueIncludingUnusedBits(params["hex"]);
          } else if (typeof params["bin"] != "undefined") {
            this.setByBinaryString(params["bin"]);
          } else if (typeof params["array"] != "undefined") {
            this.setByBooleanArray(params["array"]);
          }
        }
      };
      YAHOO.lang.extend(KJUR.asn1.DERBitString, KJUR.asn1.ASN1Object);

      // ********************************************************************
      /**
       * class for ASN.1 DER OctetString<br/>
       * @name KJUR.asn1.DEROctetString
       * @class class for ASN.1 DER OctetString
       * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
       * @extends KJUR.asn1.DERAbstractString
       * @description
       * This class provides ASN.1 OctetString simple type.<br/>
       * Supported "params" attributes are:
       * <ul>
       * <li>str - to set a string as a value</li>
       * <li>hex - to set a hexadecimal string as a value</li>
       * <li>obj - to set a encapsulated ASN.1 value by JSON object
       * which is defined in {@link KJUR.asn1.ASN1Util.newObject}</li>
       * </ul>
       * NOTE: A parameter 'obj' have been supported
       * for "OCTET STRING, encapsulates" structure.
       * since asn1 1.0.11, jsrsasign 6.1.1 (2016-Sep-25).
       * @see KJUR.asn1.DERAbstractString - superclass
       * @example
       * // default constructor
       * o = new KJUR.asn1.DEROctetString();
       * // initialize with string
       * o = new KJUR.asn1.DEROctetString({str: "aaa"});
       * // initialize with hexadecimal string
       * o = new KJUR.asn1.DEROctetString({hex: "616161"});
       * // initialize with ASN1Util.newObject argument
       * o = new KJUR.asn1.DEROctetString({obj: {seq: [{int: 3}, {prnstr: 'aaa'}]}});
       * // above generates a ASN.1 data like this:
       * // OCTET STRING, encapsulates {
       * //   SEQUENCE {
       * //     INTEGER 3
       * //     PrintableString 'aaa'
       * //     }
       * //   }
       */
      KJUR.asn1.DEROctetString = function (params) {
        if (params !== undefined && typeof params.obj !== "undefined") {
          var o = KJUR.asn1.ASN1Util.newObject(params.obj);
          params.hex = o.getEncodedHex();
        }
        KJUR.asn1.DEROctetString.superclass.constructor.call(this, params);
        this.hT = "04";
      };
      YAHOO.lang.extend(KJUR.asn1.DEROctetString, KJUR.asn1.DERAbstractString);

      // ********************************************************************
      /**
       * class for ASN.1 DER Null
       * @name KJUR.asn1.DERNull
       * @class class for ASN.1 DER Null
       * @extends KJUR.asn1.ASN1Object
       * @description
       * @see KJUR.asn1.ASN1Object - superclass
       */
      KJUR.asn1.DERNull = function () {
        KJUR.asn1.DERNull.superclass.constructor.call(this);
        this.hT = "05";
        this.hTLV = "0500";
      };
      YAHOO.lang.extend(KJUR.asn1.DERNull, KJUR.asn1.ASN1Object);

      // ********************************************************************
      /**
       * class for ASN.1 DER ObjectIdentifier
       * @name KJUR.asn1.DERObjectIdentifier
       * @class class for ASN.1 DER ObjectIdentifier
       * @param {Array} params associative array of parameters (ex. {'oid': '2.5.4.5'})
       * @extends KJUR.asn1.ASN1Object
       * @description
       * <br/>
       * As for argument 'params' for constructor, you can specify one of
       * following properties:
       * <ul>
       * <li>oid - specify initial ASN.1 value(V) by a oid string (ex. 2.5.4.13)</li>
       * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
       * </ul>
       * NOTE: 'params' can be omitted.
       */
      KJUR.asn1.DERObjectIdentifier = function (params) {
        var itox = function (i) {
          var h = i.toString(16);
          if (h.length == 1) h = "0" + h;
          return h;
        };
        var roidtox = function (roid) {
          var h = "";
          var bi = new BigInteger(roid, 10);
          var b = bi.toString(2);
          var padLen = 7 - (b.length % 7);
          if (padLen == 7) padLen = 0;
          var bPad = "";
          for (var i = 0; i < padLen; i++) bPad += "0";
          b = bPad + b;
          for (var i = 0; i < b.length - 1; i += 7) {
            var b8 = b.substr(i, 7);
            if (i != b.length - 7) b8 = "1" + b8;
            h += itox(parseInt(b8, 2));
          }
          return h;
        };

        KJUR.asn1.DERObjectIdentifier.superclass.constructor.call(this);
        this.hT = "06";

        /**
         * set value by a hexadecimal string
         * @name setValueHex
         * @memberOf KJUR.asn1.DERObjectIdentifier#
         * @function
         * @param {String} newHexString hexadecimal value of OID bytes
         */
        this.setValueHex = function (newHexString) {
          this.hTLV = null;
          this.isModified = true;
          this.s = null;
          this.hV = newHexString;
        };

        /**
         * set value by a OID string<br/>
         * @name setValueOidString
         * @memberOf KJUR.asn1.DERObjectIdentifier#
         * @function
         * @param {String} oidString OID string (ex. 2.5.4.13)
         * @example
         * o = new KJUR.asn1.DERObjectIdentifier();
         * o.setValueOidString("2.5.4.13");
         */
        this.setValueOidString = function (oidString) {
          if (!oidString.match(/^[0-9.]+$/)) {
            throw "malformed oid string: " + oidString;
          }
          var h = "";
          var a = oidString.split(".");
          var i0 = parseInt(a[0]) * 40 + parseInt(a[1]);
          h += itox(i0);
          a.splice(0, 2);
          for (var i = 0; i < a.length; i++) {
            h += roidtox(a[i]);
          }
          this.hTLV = null;
          this.isModified = true;
          this.s = null;
          this.hV = h;
        };

        /**
         * set value by a OID name
         * @name setValueName
         * @memberOf KJUR.asn1.DERObjectIdentifier#
         * @function
         * @param {String} oidName OID name (ex. 'serverAuth')
         * @since 1.0.1
         * @description
         * OID name shall be defined in 'KJUR.asn1.x509.OID.name2oidList'.
         * Otherwise raise error.
         * @example
         * o = new KJUR.asn1.DERObjectIdentifier();
         * o.setValueName("serverAuth");
         */
        this.setValueName = function (oidName) {
          var oid = KJUR.asn1.x509.OID.name2oid(oidName);
          if (oid !== "") {
            this.setValueOidString(oid);
          } else {
            throw "DERObjectIdentifier oidName undefined: " + oidName;
          }
        };

        this.getFreshValueHex = function () {
          return this.hV;
        };

        if (params !== undefined) {
          if (typeof params === "string") {
            if (params.match(/^[0-2].[0-9.]+$/)) {
              this.setValueOidString(params);
            } else {
              this.setValueName(params);
            }
          } else if (params.oid !== undefined) {
            this.setValueOidString(params.oid);
          } else if (params.hex !== undefined) {
            this.setValueHex(params.hex);
          } else if (params.name !== undefined) {
            this.setValueName(params.name);
          }
        }
      };
      YAHOO.lang.extend(KJUR.asn1.DERObjectIdentifier, KJUR.asn1.ASN1Object);

      // ********************************************************************
      /**
       * class for ASN.1 DER Enumerated
       * @name KJUR.asn1.DEREnumerated
       * @class class for ASN.1 DER Enumerated
       * @extends KJUR.asn1.ASN1Object
       * @description
       * <br/>
       * As for argument 'params' for constructor, you can specify one of
       * following properties:
       * <ul>
       * <li>int - specify initial ASN.1 value(V) by integer value</li>
       * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
       * </ul>
       * NOTE: 'params' can be omitted.
       * @example
       * new KJUR.asn1.DEREnumerated(123);
       * new KJUR.asn1.DEREnumerated({int: 123});
       * new KJUR.asn1.DEREnumerated({hex: '1fad'});
       */
      KJUR.asn1.DEREnumerated = function (params) {
        KJUR.asn1.DEREnumerated.superclass.constructor.call(this);
        this.hT = "0a";

        /**
         * set value by Tom Wu's BigInteger object
         * @name setByBigInteger
         * @memberOf KJUR.asn1.DEREnumerated#
         * @function
         * @param {BigInteger} bigIntegerValue to set
         */
        this.setByBigInteger = function (bigIntegerValue) {
          this.hTLV = null;
          this.isModified = true;
          this.hV =
            KJUR.asn1.ASN1Util.bigIntToMinTwosComplementsHex(bigIntegerValue);
        };

        /**
         * set value by integer value
         * @name setByInteger
         * @memberOf KJUR.asn1.DEREnumerated#
         * @function
         * @param {Integer} integer value to set
         */
        this.setByInteger = function (intValue) {
          var bi = new BigInteger(String(intValue), 10);
          this.setByBigInteger(bi);
        };

        /**
         * set value by integer value
         * @name setValueHex
         * @memberOf KJUR.asn1.DEREnumerated#
         * @function
         * @param {String} hexadecimal string of integer value
         * @description
         * <br/>
         * NOTE: Value shall be represented by minimum octet length of
         * two's complement representation.
         */
        this.setValueHex = function (newHexString) {
          this.hV = newHexString;
        };

        this.getFreshValueHex = function () {
          return this.hV;
        };

        if (typeof params != "undefined") {
          if (typeof params["int"] != "undefined") {
            this.setByInteger(params["int"]);
          } else if (typeof params == "number") {
            this.setByInteger(params);
          } else if (typeof params["hex"] != "undefined") {
            this.setValueHex(params["hex"]);
          }
        }
      };
      YAHOO.lang.extend(KJUR.asn1.DEREnumerated, KJUR.asn1.ASN1Object);

      // ********************************************************************
      /**
       * class for ASN.1 DER UTF8String
       * @name KJUR.asn1.DERUTF8String
       * @class class for ASN.1 DER UTF8String
       * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
       * @extends KJUR.asn1.DERAbstractString
       * @description
       * @see KJUR.asn1.DERAbstractString - superclass
       */
      KJUR.asn1.DERUTF8String = function (params) {
        KJUR.asn1.DERUTF8String.superclass.constructor.call(this, params);
        this.hT = "0c";
      };
      YAHOO.lang.extend(KJUR.asn1.DERUTF8String, KJUR.asn1.DERAbstractString);

      // ********************************************************************
      /**
       * class for ASN.1 DER NumericString
       * @name KJUR.asn1.DERNumericString
       * @class class for ASN.1 DER NumericString
       * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
       * @extends KJUR.asn1.DERAbstractString
       * @description
       * @see KJUR.asn1.DERAbstractString - superclass
       */
      KJUR.asn1.DERNumericString = function (params) {
        KJUR.asn1.DERNumericString.superclass.constructor.call(this, params);
        this.hT = "12";
      };
      YAHOO.lang.extend(
        KJUR.asn1.DERNumericString,
        KJUR.asn1.DERAbstractString
      );

      // ********************************************************************
      /**
       * class for ASN.1 DER PrintableString
       * @name KJUR.asn1.DERPrintableString
       * @class class for ASN.1 DER PrintableString
       * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
       * @extends KJUR.asn1.DERAbstractString
       * @description
       * @see KJUR.asn1.DERAbstractString - superclass
       */
      KJUR.asn1.DERPrintableString = function (params) {
        KJUR.asn1.DERPrintableString.superclass.constructor.call(this, params);
        this.hT = "13";
      };
      YAHOO.lang.extend(
        KJUR.asn1.DERPrintableString,
        KJUR.asn1.DERAbstractString
      );

      // ********************************************************************
      /**
       * class for ASN.1 DER TeletexString
       * @name KJUR.asn1.DERTeletexString
       * @class class for ASN.1 DER TeletexString
       * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
       * @extends KJUR.asn1.DERAbstractString
       * @description
       * @see KJUR.asn1.DERAbstractString - superclass
       */
      KJUR.asn1.DERTeletexString = function (params) {
        KJUR.asn1.DERTeletexString.superclass.constructor.call(this, params);
        this.hT = "14";
      };
      YAHOO.lang.extend(
        KJUR.asn1.DERTeletexString,
        KJUR.asn1.DERAbstractString
      );

      // ********************************************************************
      /**
       * class for ASN.1 DER IA5String
       * @name KJUR.asn1.DERIA5String
       * @class class for ASN.1 DER IA5String
       * @param {Array} params associative array of parameters (ex. {'str': 'aaa'})
       * @extends KJUR.asn1.DERAbstractString
       * @description
       * @see KJUR.asn1.DERAbstractString - superclass
       */
      KJUR.asn1.DERIA5String = function (params) {
        KJUR.asn1.DERIA5String.superclass.constructor.call(this, params);
        this.hT = "16";
      };
      YAHOO.lang.extend(KJUR.asn1.DERIA5String, KJUR.asn1.DERAbstractString);

      // ********************************************************************
      /**
       * class for ASN.1 DER UTCTime
       * @name KJUR.asn1.DERUTCTime
       * @class class for ASN.1 DER UTCTime
       * @param {Array} params associative array of parameters (ex. {'str': '130430235959Z'})
       * @extends KJUR.asn1.DERAbstractTime
       * @description
       * <br/>
       * As for argument 'params' for constructor, you can specify one of
       * following properties:
       * <ul>
       * <li>str - specify initial ASN.1 value(V) by a string (ex.'130430235959Z')</li>
       * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
       * <li>date - specify Date object.</li>
       * </ul>
       * NOTE: 'params' can be omitted.
       * <h4>EXAMPLES</h4>
       * @example
       * d1 = new KJUR.asn1.DERUTCTime();
       * d1.setString('130430125959Z');
       *
       * d2 = new KJUR.asn1.DERUTCTime({'str': '130430125959Z'});
       * d3 = new KJUR.asn1.DERUTCTime({'date': new Date(Date.UTC(2015, 0, 31, 0, 0, 0, 0))});
       * d4 = new KJUR.asn1.DERUTCTime('130430125959Z');
       */
      KJUR.asn1.DERUTCTime = function (params) {
        KJUR.asn1.DERUTCTime.superclass.constructor.call(this, params);
        this.hT = "17";

        /**
         * set value by a Date object<br/>
         * @name setByDate
         * @memberOf KJUR.asn1.DERUTCTime#
         * @function
         * @param {Date} dateObject Date object to set ASN.1 value(V)
         * @example
         * o = new KJUR.asn1.DERUTCTime();
         * o.setByDate(new Date("2016/12/31"));
         */
        this.setByDate = function (dateObject) {
          this.hTLV = null;
          this.isModified = true;
          this.date = dateObject;
          this.s = this.formatDate(this.date, "utc");
          this.hV = stohex(this.s);
        };

        this.getFreshValueHex = function () {
          if (typeof this.date == "undefined" && typeof this.s == "undefined") {
            this.date = new Date();
            this.s = this.formatDate(this.date, "utc");
            this.hV = stohex(this.s);
          }
          return this.hV;
        };

        if (params !== undefined) {
          if (params.str !== undefined) {
            this.setString(params.str);
          } else if (
            typeof params == "string" &&
            params.match(/^[0-9]{12}Z$/)
          ) {
            this.setString(params);
          } else if (params.hex !== undefined) {
            this.setStringHex(params.hex);
          } else if (params.date !== undefined) {
            this.setByDate(params.date);
          }
        }
      };
      YAHOO.lang.extend(KJUR.asn1.DERUTCTime, KJUR.asn1.DERAbstractTime);

      // ********************************************************************
      /**
       * class for ASN.1 DER GeneralizedTime
       * @name KJUR.asn1.DERGeneralizedTime
       * @class class for ASN.1 DER GeneralizedTime
       * @param {Array} params associative array of parameters (ex. {'str': '20130430235959Z'})
       * @property {Boolean} withMillis flag to show milliseconds or not
       * @extends KJUR.asn1.DERAbstractTime
       * @description
       * <br/>
       * As for argument 'params' for constructor, you can specify one of
       * following properties:
       * <ul>
       * <li>str - specify initial ASN.1 value(V) by a string (ex.'20130430235959Z')</li>
       * <li>hex - specify initial ASN.1 value(V) by a hexadecimal string</li>
       * <li>date - specify Date object.</li>
       * <li>millis - specify flag to show milliseconds (from 1.0.6)</li>
       * </ul>
       * NOTE1: 'params' can be omitted.
       * NOTE2: 'withMillis' property is supported from asn1 1.0.6.
       */
      KJUR.asn1.DERGeneralizedTime = function (params) {
        KJUR.asn1.DERGeneralizedTime.superclass.constructor.call(this, params);
        this.hT = "18";
        this.withMillis = false;

        /**
         * set value by a Date object
         * @name setByDate
         * @memberOf KJUR.asn1.DERGeneralizedTime#
         * @function
         * @param {Date} dateObject Date object to set ASN.1 value(V)
         * @example
         * When you specify UTC time, use 'Date.UTC' method like this:<br/>
         * o1 = new DERUTCTime();
         * o1.setByDate(date);
         *
         * date = new Date(Date.UTC(2015, 0, 31, 23, 59, 59, 0)); #2015JAN31 23:59:59
         */
        this.setByDate = function (dateObject) {
          this.hTLV = null;
          this.isModified = true;
          this.date = dateObject;
          this.s = this.formatDate(this.date, "gen", this.withMillis);
          this.hV = stohex(this.s);
        };

        this.getFreshValueHex = function () {
          if (this.date === undefined && this.s === undefined) {
            this.date = new Date();
            this.s = this.formatDate(this.date, "gen", this.withMillis);
            this.hV = stohex(this.s);
          }
          return this.hV;
        };

        if (params !== undefined) {
          if (params.str !== undefined) {
            this.setString(params.str);
          } else if (
            typeof params == "string" &&
            params.match(/^[0-9]{14}Z$/)
          ) {
            this.setString(params);
          } else if (params.hex !== undefined) {
            this.setStringHex(params.hex);
          } else if (params.date !== undefined) {
            this.setByDate(params.date);
          }
          if (params.millis === true) {
            this.withMillis = true;
          }
        }
      };
      YAHOO.lang.extend(
        KJUR.asn1.DERGeneralizedTime,
        KJUR.asn1.DERAbstractTime
      );

      // ********************************************************************
      /**
       * class for ASN.1 DER Sequence
       * @name KJUR.asn1.DERSequence
       * @class class for ASN.1 DER Sequence
       * @extends KJUR.asn1.DERAbstractStructured
       * @description
       * <br/>
       * As for argument 'params' for constructor, you can specify one of
       * following properties:
       * <ul>
       * <li>array - specify array of ASN1Object to set elements of content</li>
       * </ul>
       * NOTE: 'params' can be omitted.
       */
      KJUR.asn1.DERSequence = function (params) {
        KJUR.asn1.DERSequence.superclass.constructor.call(this, params);
        this.hT = "30";
        this.getFreshValueHex = function () {
          var h = "";
          for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            h += asn1Obj.getEncodedHex();
          }
          this.hV = h;
          return this.hV;
        };
      };
      YAHOO.lang.extend(KJUR.asn1.DERSequence, KJUR.asn1.DERAbstractStructured);

      // ********************************************************************
      /**
       * class for ASN.1 DER Set
       * @name KJUR.asn1.DERSet
       * @class class for ASN.1 DER Set
       * @extends KJUR.asn1.DERAbstractStructured
       * @description
       * <br/>
       * As for argument 'params' for constructor, you can specify one of
       * following properties:
       * <ul>
       * <li>array - specify array of ASN1Object to set elements of content</li>
       * <li>sortflag - flag for sort (default: true). ASN.1 BER is not sorted in 'SET OF'.</li>
       * </ul>
       * NOTE1: 'params' can be omitted.<br/>
       * NOTE2: sortflag is supported since 1.0.5.
       */
      KJUR.asn1.DERSet = function (params) {
        KJUR.asn1.DERSet.superclass.constructor.call(this, params);
        this.hT = "31";
        this.sortFlag = true; // item shall be sorted only in ASN.1 DER
        this.getFreshValueHex = function () {
          var a = new Array();
          for (var i = 0; i < this.asn1Array.length; i++) {
            var asn1Obj = this.asn1Array[i];
            a.push(asn1Obj.getEncodedHex());
          }
          if (this.sortFlag == true) a.sort();
          this.hV = a.join("");
          return this.hV;
        };

        if (typeof params != "undefined") {
          if (typeof params.sortflag != "undefined" && params.sortflag == false)
            this.sortFlag = false;
        }
      };
      YAHOO.lang.extend(KJUR.asn1.DERSet, KJUR.asn1.DERAbstractStructured);

      // ********************************************************************
      /**
       * class for ASN.1 DER TaggedObject
       * @name KJUR.asn1.DERTaggedObject
       * @class class for ASN.1 DER TaggedObject
       * @extends KJUR.asn1.ASN1Object
       * @description
       * <br/>
       * Parameter 'tagNoNex' is ASN.1 tag(T) value for this object.
       * For example, if you find '[1]' tag in a ASN.1 dump,
       * 'tagNoHex' will be 'a1'.
       * <br/>
       * As for optional argument 'params' for constructor, you can specify *ANY* of
       * following properties:
       * <ul>
       * <li>explicit - specify true if this is explicit tag otherwise false
       *     (default is 'true').</li>
       * <li>tag - specify tag (default is 'a0' which means [0])</li>
       * <li>obj - specify ASN1Object which is tagged</li>
       * </ul>
       * @example
       * d1 = new KJUR.asn1.DERUTF8String({'str':'a'});
       * d2 = new KJUR.asn1.DERTaggedObject({'obj': d1});
       * hex = d2.getEncodedHex();
       */
      KJUR.asn1.DERTaggedObject = function (params) {
        KJUR.asn1.DERTaggedObject.superclass.constructor.call(this);
        this.hT = "a0";
        this.hV = "";
        this.isExplicit = true;
        this.asn1Object = null;

        /**
         * set value by an ASN1Object
         * @name setString
         * @memberOf KJUR.asn1.DERTaggedObject#
         * @function
         * @param {Boolean} isExplicitFlag flag for explicit/implicit tag
         * @param {Integer} tagNoHex hexadecimal string of ASN.1 tag
         * @param {ASN1Object} asn1Object ASN.1 to encapsulate
         */
        this.setASN1Object = function (isExplicitFlag, tagNoHex, asn1Object) {
          this.hT = tagNoHex;
          this.isExplicit = isExplicitFlag;
          this.asn1Object = asn1Object;
          if (this.isExplicit) {
            this.hV = this.asn1Object.getEncodedHex();
            this.hTLV = null;
            this.isModified = true;
          } else {
            this.hV = null;
            this.hTLV = asn1Object.getEncodedHex();
            this.hTLV = this.hTLV.replace(/^../, tagNoHex);
            this.isModified = false;
          }
        };

        this.getFreshValueHex = function () {
          return this.hV;
        };

        if (typeof params != "undefined") {
          if (typeof params["tag"] != "undefined") {
            this.hT = params["tag"];
          }
          if (typeof params["explicit"] != "undefined") {
            this.isExplicit = params["explicit"];
          }
          if (typeof params["obj"] != "undefined") {
            this.asn1Object = params["obj"];
            this.setASN1Object(this.isExplicit, this.hT, this.asn1Object);
          }
        }
      };
      YAHOO.lang.extend(KJUR.asn1.DERTaggedObject, KJUR.asn1.ASN1Object);

      /**
       * Create a new JSEncryptRSAKey that extends Tom Wu's RSA key object.
       * This object is just a decorator for parsing the key parameter
       * @param {string|Object} key - The key in string format, or an object containing
       * the parameters needed to build a RSAKey object.
       * @constructor
       */
      var JSEncryptRSAKey = /** @class */ (function (_super) {
        __extends(JSEncryptRSAKey, _super);
        function JSEncryptRSAKey(key) {
          var _this = _super.call(this) || this;
          // Call the super constructor.
          //  RSAKey.call(this);
          // If a key key was provided.
          if (key) {
            // If this is a string...
            if (typeof key === "string") {
              _this.parseKey(key);
            } else if (
              JSEncryptRSAKey.hasPrivateKeyProperty(key) ||
              JSEncryptRSAKey.hasPublicKeyProperty(key)
            ) {
              // Set the values for the key.
              _this.parsePropertiesFrom(key);
            }
          }
          return _this;
        }
        /**
         * Method to parse a pem encoded string containing both a public or private key.
         * The method will translate the pem encoded string in a der encoded string and
         * will parse private key and public key parameters. This method accepts public key
         * in the rsaencryption pkcs #1 format (oid: 1.2.840.113549.1.1.1).
         *
         * @todo Check how many rsa formats use the same format of pkcs #1.
         *
         * The format is defined as:
         * PublicKeyInfo ::= SEQUENCE {
         *   algorithm       AlgorithmIdentifier,
         *   PublicKey       BIT STRING
         * }
         * Where AlgorithmIdentifier is:
         * AlgorithmIdentifier ::= SEQUENCE {
         *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
         *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
         * }
         * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
         * RSAPublicKey ::= SEQUENCE {
         *   modulus           INTEGER,  -- n
         *   publicExponent    INTEGER   -- e
         * }
         * it's possible to examine the structure of the keys obtained from openssl using
         * an asn.1 dumper as the one used here to parse the components: http://lapo.it/asn1js/
         * @argument {string} pem the pem encoded string, can include the BEGIN/END header/footer
         * @private
         */
        JSEncryptRSAKey.prototype.parseKey = function (pem) {
          try {
            var modulus = 0;
            var public_exponent = 0;
            var reHex = /^\s*(?:[0-9A-Fa-f][0-9A-Fa-f]\s*)+$/;
            var der = reHex.test(pem) ? Hex.decode(pem) : Base64.unarmor(pem);
            var asn1 = ASN1.decode(der);
            // Fixes a bug with OpenSSL 1.0+ private keys
            if (asn1.sub.length === 3) {
              asn1 = asn1.sub[2].sub[0];
            }
            if (asn1.sub.length === 9) {
              // Parse the private key.
              modulus = asn1.sub[1].getHexStringValue(); // bigint
              this.n = parseBigInt(modulus, 16);
              public_exponent = asn1.sub[2].getHexStringValue(); // int
              this.e = parseInt(public_exponent, 16);
              var private_exponent = asn1.sub[3].getHexStringValue(); // bigint
              this.d = parseBigInt(private_exponent, 16);
              var prime1 = asn1.sub[4].getHexStringValue(); // bigint
              this.p = parseBigInt(prime1, 16);
              var prime2 = asn1.sub[5].getHexStringValue(); // bigint
              this.q = parseBigInt(prime2, 16);
              var exponent1 = asn1.sub[6].getHexStringValue(); // bigint
              this.dmp1 = parseBigInt(exponent1, 16);
              var exponent2 = asn1.sub[7].getHexStringValue(); // bigint
              this.dmq1 = parseBigInt(exponent2, 16);
              var coefficient = asn1.sub[8].getHexStringValue(); // bigint
              this.coeff = parseBigInt(coefficient, 16);
            } else if (asn1.sub.length === 2) {
              // Parse the public key.
              var bit_string = asn1.sub[1];
              var sequence = bit_string.sub[0];
              modulus = sequence.sub[0].getHexStringValue();
              this.n = parseBigInt(modulus, 16);
              public_exponent = sequence.sub[1].getHexStringValue();
              this.e = parseInt(public_exponent, 16);
            } else {
              return false;
            }
            return true;
          } catch (ex) {
            return false;
          }
        };
        /**
         * Translate rsa parameters in a hex encoded string representing the rsa key.
         *
         * The translation follow the ASN.1 notation :
         * RSAPrivateKey ::= SEQUENCE {
         *   version           Version,
         *   modulus           INTEGER,  -- n
         *   publicExponent    INTEGER,  -- e
         *   privateExponent   INTEGER,  -- d
         *   prime1            INTEGER,  -- p
         *   prime2            INTEGER,  -- q
         *   exponent1         INTEGER,  -- d mod (p1)
         *   exponent2         INTEGER,  -- d mod (q-1)
         *   coefficient       INTEGER,  -- (inverse of q) mod p
         * }
         * @returns {string}  DER Encoded String representing the rsa private key
         * @private
         */
        JSEncryptRSAKey.prototype.getPrivateBaseKey = function () {
          var options = {
            array: [
              new KJUR.asn1.DERInteger({ int: 0 }),
              new KJUR.asn1.DERInteger({ bigint: this.n }),
              new KJUR.asn1.DERInteger({ int: this.e }),
              new KJUR.asn1.DERInteger({ bigint: this.d }),
              new KJUR.asn1.DERInteger({ bigint: this.p }),
              new KJUR.asn1.DERInteger({ bigint: this.q }),
              new KJUR.asn1.DERInteger({ bigint: this.dmp1 }),
              new KJUR.asn1.DERInteger({ bigint: this.dmq1 }),
              new KJUR.asn1.DERInteger({ bigint: this.coeff }),
            ],
          };
          var seq = new KJUR.asn1.DERSequence(options);
          return seq.getEncodedHex();
        };
        /**
         * base64 (pem) encoded version of the DER encoded representation
         * @returns {string} pem encoded representation without header and footer
         * @public
         */
        JSEncryptRSAKey.prototype.getPrivateBaseKeyB64 = function () {
          return hex2b64(this.getPrivateBaseKey());
        };
        /**
         * Translate rsa parameters in a hex encoded string representing the rsa public key.
         * The representation follow the ASN.1 notation :
         * PublicKeyInfo ::= SEQUENCE {
         *   algorithm       AlgorithmIdentifier,
         *   PublicKey       BIT STRING
         * }
         * Where AlgorithmIdentifier is:
         * AlgorithmIdentifier ::= SEQUENCE {
         *   algorithm       OBJECT IDENTIFIER,     the OID of the enc algorithm
         *   parameters      ANY DEFINED BY algorithm OPTIONAL (NULL for PKCS #1)
         * }
         * and PublicKey is a SEQUENCE encapsulated in a BIT STRING
         * RSAPublicKey ::= SEQUENCE {
         *   modulus           INTEGER,  -- n
         *   publicExponent    INTEGER   -- e
         * }
         * @returns {string} DER Encoded String representing the rsa public key
         * @private
         */
        JSEncryptRSAKey.prototype.getPublicBaseKey = function () {
          var first_sequence = new KJUR.asn1.DERSequence({
            array: [
              new KJUR.asn1.DERObjectIdentifier({
                oid: "1.2.840.113549.1.1.1",
              }),
              new KJUR.asn1.DERNull(),
            ],
          });
          var second_sequence = new KJUR.asn1.DERSequence({
            array: [
              new KJUR.asn1.DERInteger({ bigint: this.n }),
              new KJUR.asn1.DERInteger({ int: this.e }),
            ],
          });
          var bit_string = new KJUR.asn1.DERBitString({
            hex: "00" + second_sequence.getEncodedHex(),
          });
          var seq = new KJUR.asn1.DERSequence({
            array: [first_sequence, bit_string],
          });
          return seq.getEncodedHex();
        };
        /**
         * base64 (pem) encoded version of the DER encoded representation
         * @returns {string} pem encoded representation without header and footer
         * @public
         */
        JSEncryptRSAKey.prototype.getPublicBaseKeyB64 = function () {
          return hex2b64(this.getPublicBaseKey());
        };
        /**
         * wrap the string in block of width chars. The default value for rsa keys is 64
         * characters.
         * @param {string} str the pem encoded string without header and footer
         * @param {Number} [width=64] - the length the string has to be wrapped at
         * @returns {string}
         * @private
         */
        JSEncryptRSAKey.wordwrap = function (str, width) {
          width = width || 64;
          if (!str) {
            return str;
          }
          var regex = "(.{1," + width + "})( +|$\n?)|(.{1," + width + "})";
          return str.match(RegExp(regex, "g")).join("\n");
        };
        /**
         * Retrieve the pem encoded private key
         * @returns {string} the pem encoded private key with header/footer
         * @public
         */
        JSEncryptRSAKey.prototype.getPrivateKey = function () {
          var key = "-----BEGIN RSA PRIVATE KEY-----\n";
          key += JSEncryptRSAKey.wordwrap(this.getPrivateBaseKeyB64()) + "\n";
          key += "-----END RSA PRIVATE KEY-----";
          return key;
        };
        /**
         * Retrieve the pem encoded public key
         * @returns {string} the pem encoded public key with header/footer
         * @public
         */
        JSEncryptRSAKey.prototype.getPublicKey = function () {
          var key = "-----BEGIN PUBLIC KEY-----\n";
          key += JSEncryptRSAKey.wordwrap(this.getPublicBaseKeyB64()) + "\n";
          key += "-----END PUBLIC KEY-----";
          return key;
        };
        /**
         * Check if the object contains the necessary parameters to populate the rsa modulus
         * and public exponent parameters.
         * @param {Object} [obj={}] - An object that may contain the two public key
         * parameters
         * @returns {boolean} true if the object contains both the modulus and the public exponent
         * properties (n and e)
         * @todo check for types of n and e. N should be a parseable bigInt object, E should
         * be a parseable integer number
         * @private
         */
        JSEncryptRSAKey.hasPublicKeyProperty = function (obj) {
          obj = obj || {};
          return obj.hasOwnProperty("n") && obj.hasOwnProperty("e");
        };
        /**
         * Check if the object contains ALL the parameters of an RSA key.
         * @param {Object} [obj={}] - An object that may contain nine rsa key
         * parameters
         * @returns {boolean} true if the object contains all the parameters needed
         * @todo check for types of the parameters all the parameters but the public exponent
         * should be parseable bigint objects, the public exponent should be a parseable integer number
         * @private
         */
        JSEncryptRSAKey.hasPrivateKeyProperty = function (obj) {
          obj = obj || {};
          return (
            obj.hasOwnProperty("n") &&
            obj.hasOwnProperty("e") &&
            obj.hasOwnProperty("d") &&
            obj.hasOwnProperty("p") &&
            obj.hasOwnProperty("q") &&
            obj.hasOwnProperty("dmp1") &&
            obj.hasOwnProperty("dmq1") &&
            obj.hasOwnProperty("coeff")
          );
        };
        /**
         * Parse the properties of obj in the current rsa object. Obj should AT LEAST
         * include the modulus and public exponent (n, e) parameters.
         * @param {Object} obj - the object containing rsa parameters
         * @private
         */
        JSEncryptRSAKey.prototype.parsePropertiesFrom = function (obj) {
          this.n = obj.n;
          this.e = obj.e;
          if (obj.hasOwnProperty("d")) {
            this.d = obj.d;
            this.p = obj.p;
            this.q = obj.q;
            this.dmp1 = obj.dmp1;
            this.dmq1 = obj.dmq1;
            this.coeff = obj.coeff;
          }
        };
        return JSEncryptRSAKey;
      })(RSAKey);

      /**
       *
       * @param {Object} [options = {}] - An object to customize JSEncrypt behaviour
       * possible parameters are:
       * - default_key_size        {number}  default: 1024 the key size in bit
       * - default_public_exponent {string}  default: '010001' the hexadecimal representation of the public exponent
       * - log                     {boolean} default: false whether log warn/error or not
       * @constructor
       */
      var JSEncrypt = /** @class */ (function () {
        function JSEncrypt(options) {
          options = options || {};
          this.default_key_size =
            parseInt(options.default_key_size, 10) || 1024;
          this.default_public_exponent =
            options.default_public_exponent || "010001"; // 65537 default openssl public exponent for rsa key type
          this.log = options.log || false;
          // The private and public key.
          this.key = null;
        }
        /**
         * Method to set the rsa key parameter (one method is enough to set both the public
         * and the private key, since the private key contains the public key paramenters)
         * Log a warning if logs are enabled
         * @param {Object|string} key the pem encoded string or an object (with or without header/footer)
         * @public
         */
        JSEncrypt.prototype.setKey = function (key) {
          if (this.log && this.key) {
            console.warn("A key was already set, overriding existing.");
          }
          this.key = new JSEncryptRSAKey(key);
        };
        /**
         * Proxy method for setKey, for api compatibility
         * @see setKey
         * @public
         */
        JSEncrypt.prototype.setPrivateKey = function (privkey) {
          // Create the key.
          this.setKey(privkey);
        };
        /**
         * Proxy method for setKey, for api compatibility
         * @see setKey
         * @public
         */
        JSEncrypt.prototype.setPublicKey = function (pubkey) {
          // Sets the public key.
          this.setKey(pubkey);
        };
        /**
         * Proxy method for RSAKey object's decrypt, decrypt the string using the private
         * components of the rsa key object. Note that if the object was not set will be created
         * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
         * @param {string} str base64 encoded crypted string to decrypt
         * @return {string} the decrypted string
         * @public
         */
        JSEncrypt.prototype.decrypt = function (str) {
          // Return the decrypted string.
          try {
            return this.getKey().decrypt(b64tohex(str));
          } catch (ex) {
            return false;
          }
        };
        /**
         * Proxy method for RSAKey object's encrypt, encrypt the string using the public
         * components of the rsa key object. Note that if the object was not set will be created
         * on the fly (by the getKey method) using the parameters passed in the JSEncrypt constructor
         * @param {string} str the string to encrypt
         * @return {string} the encrypted string encoded in base64
         * @public
         */
        JSEncrypt.prototype.encrypt = function (str) {
          // Return the encrypted string.
          try {
            return hex2b64(this.getKey().encrypt(str));
          } catch (ex) {
            return false;
          }
        };
        /**
         * Proxy method for RSAKey object's sign.
         * @param {string} str the string to sign
         * @param {function} digestMethod hash method
         * @param {string} digestName the name of the hash algorithm
         * @return {string} the signature encoded in base64
         * @public
         */
        JSEncrypt.prototype.sign = function (str, digestMethod, digestName) {
          // return the RSA signature of 'str' in 'hex' format.
          try {
            return hex2b64(this.getKey().sign(str, digestMethod, digestName));
          } catch (ex) {
            return false;
          }
        };
        /**
         * Proxy method for RSAKey object's verify.
         * @param {string} str the string to verify
         * @param {string} signature the signature encoded in base64 to compare the string to
         * @param {function} digestMethod hash method
         * @return {boolean} whether the data and signature match
         * @public
         */
        JSEncrypt.prototype.verify = function (str, signature, digestMethod) {
          // Return the decrypted 'digest' of the signature.
          try {
            return this.getKey().verify(str, b64tohex(signature), digestMethod);
          } catch (ex) {
            return false;
          }
        };
        /**
         * Getter for the current JSEncryptRSAKey object. If it doesn't exists a new object
         * will be created and returned
         * @param {callback} [cb] the callback to be called if we want the key to be generated
         * in an async fashion
         * @returns {JSEncryptRSAKey} the JSEncryptRSAKey object
         * @public
         */
        JSEncrypt.prototype.getKey = function (cb) {
          // Only create new if it does not exist.
          if (!this.key) {
            // Get a new private key.
            this.key = new JSEncryptRSAKey();
            if (cb && {}.toString.call(cb) === "[object Function]") {
              this.key.generateAsync(
                this.default_key_size,
                this.default_public_exponent,
                cb
              );
              return;
            }
            // Generate the key.
            this.key.generate(
              this.default_key_size,
              this.default_public_exponent
            );
          }
          return this.key;
        };
        /**
         * Returns the pem encoded representation of the private key
         * If the key doesn't exists a new key will be created
         * @returns {string} pem encoded representation of the private key WITH header and footer
         * @public
         */
        JSEncrypt.prototype.getPrivateKey = function () {
          // Return the private representation of this key.
          return this.getKey().getPrivateKey();
        };
        /**
         * Returns the pem encoded representation of the private key
         * If the key doesn't exists a new key will be created
         * @returns {string} pem encoded representation of the private key WITHOUT header and footer
         * @public
         */
        JSEncrypt.prototype.getPrivateKeyB64 = function () {
          // Return the private representation of this key.
          return this.getKey().getPrivateBaseKeyB64();
        };
        /**
         * Returns the pem encoded representation of the public key
         * If the key doesn't exists a new key will be created
         * @returns {string} pem encoded representation of the public key WITH header and footer
         * @public
         */
        JSEncrypt.prototype.getPublicKey = function () {
          // Return the private representation of this key.
          return this.getKey().getPublicKey();
        };
        /**
         * Returns the pem encoded representation of the public key
         * If the key doesn't exists a new key will be created
         * @returns {string} pem encoded representation of the public key WITHOUT header and footer
         * @public
         */
        JSEncrypt.prototype.getPublicKeyB64 = function () {
          // Return the private representation of this key.
          return this.getKey().getPublicBaseKeyB64();
        };
        JSEncrypt.version = "3.0.0-rc.1";
        return JSEncrypt;
      })();

      window.JSEncrypt = JSEncrypt;

      exports.JSEncrypt = JSEncrypt;
      exports.default = JSEncrypt;

      Object.defineProperty(exports, "__esModule", { value: true });
    });
  });

  var JSEncrypt = unwrapExports(jsencrypt);

  const INVALID_NUMBER = {
    code: "INVALID_NUMBER",
    message: "invalid card `number`",
  };
  const INVALID_NUMBER_LENGTH = {
    code: "INVALID_NUMBER",
    message:
      "invalid field `number`. You must pass a value between 13 and 19 digits",
  };
  const INVALID_SECURITY_CODE = {
    code: "INVALID_SECURITY_CODE",
    message:
      "invalid field `securityCode`. You must pass a value with 3, 4 or none digits",
  };
  const INVALID_EXPIRATION_MONTH = {
    code: "INVALID_EXPIRATION_MONTH",
    message: "invalid field `expMonth`. You must pass a value between 1 and 12",
  };
  const INVALID_EXPIRATION_YEAR = {
    code: "INVALID_EXPIRATION_YEAR",
    message:
      "invalid field `expYear`. You must pass a value between 1900 and 2099",
  };
  const INVALID_PUBLIC_KEY = {
    code: "INVALID_PUBLIC_KEY",
    message: "invalid `publicKey`",
  };
  const INVALID_HOLDER = {
    code: "INVALID_HOLDER",
    message: "invalid `holder`",
  };

  var validationErrors = {
    INVALID_NUMBER,
    INVALID_NUMBER_LENGTH,
    INVALID_SECURITY_CODE,
    INVALID_EXPIRATION_MONTH,
    INVALID_EXPIRATION_YEAR,
    INVALID_PUBLIC_KEY,
    INVALID_HOLDER,
  };

  function formatToString(field, trunk) {
    return ((field || "") + "").trim();
  }

  function formatExpMonth(expMonth) {
    const month = formatToString(expMonth);

    return month.length === 1 ? `0${month}` : month;
  }

  function trunkString(field, maxLength) {
    return formatToString(field).substring(0, maxLength);
  }

  function sanitize(creditCard) {
    return {
      holder: trunkString(creditCard.holder, 30),
      number: formatToString(creditCard.number),
      securityCode: formatToString(creditCard.securityCode),
      expMonth: formatExpMonth(creditCard.expMonth),
      expYear: formatToString(creditCard.expYear),
      publicKey: formatToString(creditCard.publicKey),
    };
  }

  function cardNumberEmptyValidation({ number: pan }) {
    if (!pan) {
      return validationErrors.INVALID_NUMBER;
    }
  }

  function cardNumberOnlyNumberValidation({ number: pan }) {
    if (pan) {
      if (!isNumber(pan)) {
        return validationErrors.INVALID_NUMBER;
      }
    }
  }

  function cardNumberLengthValidator({ number: pan }) {
    if (pan) {
      if (!(pan.length >= 13 && pan.length <= 19)) {
        return validationErrors.INVALID_NUMBER_LENGTH;
      }
    }
  }
  function isNumber(numberInput) {
    return !isNaN(numberInput);
  }

  function containsNumber(input) {
    return /\d/.test(input);
  }

  function securityCodeValidator({ securityCode }) {
    if (securityCode) {
      if (
        !(
          isNumber(securityCode) &&
          (securityCode.length === 3 || securityCode.length === 4)
        )
      ) {
        return validationErrors.INVALID_SECURITY_CODE;
      }
    }
  }
  function expMonthValidator({ expMonth }) {
    if (
      !expMonth ||
      !(
        isNumber(expMonth) &&
        parseInt(expMonth, 10) >= 1 &&
        parseInt(expMonth, 10) <= 12
      )
    ) {
      return validationErrors.INVALID_EXPIRATION_MONTH;
    }
  }
  function expYearValidator({ expYear }) {
    if (
      !expYear ||
      !(
        isNumber(expYear) &&
        parseInt(expYear, 10) >= 1900 &&
        parseInt(expYear, 10) <= 2099
      )
    ) {
      return validationErrors.INVALID_EXPIRATION_YEAR;
    }
  }
  function holderValidator({ holder }) {
    if (!holder || containsNumber(holder)) {
      return validationErrors.INVALID_HOLDER;
    }
  }

  function validateCard(card) {
    return [
      cardNumberEmptyValidation,
      cardNumberOnlyNumberValidation,
      cardNumberLengthValidator,
      securityCodeValidator,
      expMonthValidator,
      expYearValidator,
      holderValidator,
    ]
      .map((validator) => validator(card))
      .filter((error) => error);
  }

  const jsEncrypt = new JSEncrypt();

  var encryptCard = (card) => {
    const sanitizedCard = sanitize(card);

    const result = {
      errors: validateCard(sanitizedCard),
      encryptedCard: null,
      hasErrors: true,
    };

    if (result.errors.length === 0) {
      jsEncrypt.setPublicKey(sanitizedCard.publicKey);
      const {
        number: pan,
        holder,
        securityCode,
        expMonth,
        expYear,
      } = sanitizedCard;
      const encryptedData = jsEncrypt.encrypt(
        `${pan};${securityCode};${expMonth};${expYear};${holder};${Date.now()}`
      );

      if (encryptedData) {
        result.hasErrors = false;
        result.encryptedCard = encryptedData;
      } else {
        result.errors.push(validationErrors.INVALID_PUBLIC_KEY);
      }
    }

    return result;
  };

  class PagSeguroConfigs {
    constructor() {
      // configura valores default
      this.environment = "PROD";
      this.session = "FORBIDDEN";
    }

    getEnvironment() {
      return this.environment;
    }

    getSession() {
      return this.session;
    }

    setUp(parameters) {
      this.environment = parameters.env || this.environment;
      this.session = parameters.session || this.session;
    }

    urls() {
      switch (this.environment) {
        case "LOCAL":
          return {
            checkoutSdkService: "http://localhost:8085",
            songbird:
              "https://songbirdstag.cardinalcommerce.com/edge/v1/songbird.js",
          };
        case "QA":
          return {
            checkoutSdkService: "https://qa.sdk.pagseguro.com/checkout-sdk",
            songbird:
              "https://songbirdstag.cardinalcommerce.com/edge/v1/songbird.js",
          };
        case "SANDBOX-QA":
          return {
            checkoutSdkService:
              "https://sandbox.qa.sdk.pagseguro.com/checkout-sdk",
            songbird:
              "https://songbirdstag.cardinalcommerce.com/edge/v1/songbird.js",
          };
        case "SANDBOX":
          return {
            checkoutSdkService:
              "https://sandbox.sdk.pagseguro.com/checkout-sdk",
            songbird:
              "https://songbirdstag.cardinalcommerce.com/edge/v1/songbird.js",
          };
        default:
          return {
            checkoutSdkService: "https://sdk.pagseguro.com/checkout-sdk",
            songbird:
              "https://songbird.cardinalcommerce.com/edge/v1/songbird.js",
          };
      }
    }
  }

  const PSConfigurations = new PagSeguroConfigs();

  class PagSeguroError extends Error {
    constructor(message, detail) {
      super(message);
      this.name = "PagSeguroError";
      this.detail = detail;
    }
  }

  async function getPublicKey() {
    return exchange({
      url: PSConfigurations.urls().checkoutSdkService + "/public-key",
      method: "GET",
    });
  }

  async function initializeAuthentication(request) {
    return exchange({
      url: PSConfigurations.urls().checkoutSdkService + "/3ds/authentications",
      method: "POST",
      body: request,
    });
  }

  async function confirmAuthentication(id) {
    return exchange({
      url:
        PSConfigurations.urls().checkoutSdkService +
        "/3ds/authentications/" +
        id,
      method: "POST",
    });
  }

  async function verifyAuthentication(id, challengeJwt) {
    return exchange({
      url:
        PSConfigurations.urls().checkoutSdkService +
        "/3ds/authentications/" +
        id,
      method: "PATCH",
      body: { jwt: challengeJwt },
    });
  }

  async function exchange(params) {
    const response = await fetch(params.url, {
      method: params.method,
      body: params.body ? JSON.stringify(params.body) : null,
      headers: {
        Authorization: PSConfigurations.getSession(),
        "Content-Type": "application/json",
      },
    });

    let responseBody = await response.json();

    if (!response.ok) {
      throw new PagSeguroError(
        params.method + " from " + params.url + " return " + response.status,
        responseBody
      );
    }

    return responseBody;
  }

  let songbirdIsLoaded = false;
  const emptyJwt =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.Et9HFtf9R3GEMA0IICOfFMVXY7kkTX1wr4qCyhIf58U";

  async function setUp(initialization) {
    let setupTimeout = new Promise((res, rej) => {
      setTimeout(() => {
        rej(
          new PagSeguroError("Error in Songbird setup", {
            httpStatus: 500,
            traceId: "songbirdSdkError",
            message: "Error in Songbird setup",
          })
        );
      }, 15000);
    });

    let setup = new Promise((resolve, reject) => {
      if (PSConfigurations.getEnvironment() == "SANDBOX") {
        return resolve();
      }
      let initCardinal = function () {
        songbirdIsLoaded = true;

        Cardinal.off("payments.setupComplete");

        Cardinal.on("payments.setupComplete", function (setupCompleteData) {
          Cardinal.trigger("accountNumber.update", initialization.bin).then(
            (r) => resolve()
          );
        });

        Cardinal.setup("init", {
          jwt: initialization.jwt,
        });
      };

      if (songbirdIsLoaded) {
        initCardinal();
      } else {
        var head = document.getElementsByTagName("head")[0];
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = PSConfigurations.urls().songbird;
        script.onreadystatechange = initCardinal;
        script.onload = initCardinal;
        head.appendChild(script);
      }
    });

    return Promise.race([setupTimeout, setup]);
  }

  async function executeChallenge(
    challengeConfiguration,
    beforeChallengeFunction
  ) {
    if (PSConfigurations.getEnvironment() == "SANDBOX") {
      return new Promise((resolve, reject) => {
        const openChallenge = function () {
          if (window.confirm("Para continuar confirme essa transaÃ§Ã£o.")) {
            resolve(challengeConfiguration.payload);
          } else {
            resolve(emptyJwt);
          }
        };
        if (typeof beforeChallengeFunction === "function") {
          beforeChallengeFunction({
            open: openChallenge,
            brand: challengeConfiguration.brand,
            issuer: challengeConfiguration.issuer,
          });
        } else {
          openChallenge();
        }
      });
    }
    return new Promise((resolve, reject) => {
      Cardinal.off("payments.validated");

      Cardinal.on("payments.validated", function (data, jwt) {
        if (jwt) {
          resolve(jwt);
        } else {
          reject(
            new PagSeguroError("Error while processing challenge", {
              httpStatus: 502,
              traceId: "songbirdSdkError",
              message:
                "Error while processing challenge: " + JSON.stringify(data),
            })
          );
        }
      });

      const openChallenge = function () {
        Cardinal.continue(
          "cca",
          {
            AcsUrl: challengeConfiguration.acsUrl,
            Payload: challengeConfiguration.payload,
          },
          {
            OrderDetails: {
              TransactionId: challengeConfiguration.transactionId,
            },
          }
        );
      };

      if (typeof beforeChallengeFunction === "function") {
        beforeChallengeFunction({
          open: openChallenge,
          brand: challengeConfiguration.brand,
          issuer: challengeConfiguration.issuer,
        });
      } else {
        openChallenge();
      }
    });
  }

  /*! *****************************************************************************
	Copyright (c) Microsoft Corporation.

	Permission to use, copy, modify, and/or distribute this software for any
	purpose with or without fee is hereby granted.

	THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
	REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
	AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
	INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
	LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
	OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
	PERFORMANCE OF THIS SOFTWARE.
	***************************************************************************** */

  var __assign = function () {
    __assign =
      Object.assign ||
      function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };

  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  }

  function __generator(thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }

  /** @deprecated */
  function __spreadArrays() {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++)
      s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
        r[k] = a[j];
    return r;
  }

  /**
   * FingerprintJS v3.3.2 - Copyright (c) FingerprintJS, Inc, 2021 (https://fingerprintjs.com)
   * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
   *
   * This software contains code from open-source projects:
   * MurmurHash3 by Karan Lyons (https://github.com/karanlyons/murmurHash3.js)
   */

  var version = "3.3.2";

  function wait(durationMs, resolveWith) {
    return new Promise(function (resolve) {
      return setTimeout(resolve, durationMs, resolveWith);
    });
  }
  function requestIdleCallbackIfAvailable(fallbackTimeout, deadlineTimeout) {
    if (deadlineTimeout === void 0) {
      deadlineTimeout = Infinity;
    }
    var requestIdleCallback = window.requestIdleCallback;
    if (requestIdleCallback) {
      // The function `requestIdleCallback` loses the binding to `window` here.
      // `globalThis` isn't always equal `window` (see https://github.com/fingerprintjs/fingerprintjs/issues/683).
      // Therefore, an error can occur. `call(window,` prevents the error.
      return new Promise(function (resolve) {
        return requestIdleCallback.call(
          window,
          function () {
            return resolve();
          },
          { timeout: deadlineTimeout }
        );
      });
    } else {
      return wait(Math.min(fallbackTimeout, deadlineTimeout));
    }
  }
  function isPromise(value) {
    return value && typeof value.then === "function";
  }
  /**
   * Calls a maybe asynchronous function without creating microtasks when the function is synchronous.
   * Catches errors in both cases.
   *
   * If just you run a code like this:
   * ```
   * console.time('Action duration')
   * await action()
   * console.timeEnd('Action duration')
   * ```
   * The synchronous function time can be measured incorrectly because another microtask may run before the `await`
   * returns the control back to the code.
   */
  function awaitIfAsync(action, callback) {
    try {
      var returnedValue = action();
      if (isPromise(returnedValue)) {
        returnedValue.then(
          function (result) {
            return callback(true, result);
          },
          function (error) {
            return callback(false, error);
          }
        );
      } else {
        callback(true, returnedValue);
      }
    } catch (error) {
      callback(false, error);
    }
  }
  /**
   * If you run many synchronous tasks without using this function, the JS main loop will be busy and asynchronous tasks
   * (e.g. completing a network request, rendering the page) won't be able to happen.
   * This function allows running many synchronous tasks such way that asynchronous tasks can run too in background.
   */
  function forEachWithBreaks(items, callback, loopReleaseInterval) {
    if (loopReleaseInterval === void 0) {
      loopReleaseInterval = 16;
    }
    return __awaiter(this, void 0, void 0, function () {
      var lastLoopReleaseTime, i, now;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            lastLoopReleaseTime = Date.now();
            i = 0;
            _a.label = 1;
          case 1:
            if (!(i < items.length)) return [3 /*break*/, 4];
            callback(items[i], i);
            now = Date.now();
            if (!(now >= lastLoopReleaseTime + loopReleaseInterval))
              return [3 /*break*/, 3];
            lastLoopReleaseTime = now;
            // Allows asynchronous actions and microtasks to happen
            return [4 /*yield*/, wait(0)];
          case 2:
            // Allows asynchronous actions and microtasks to happen
            _a.sent();
            _a.label = 3;
          case 3:
            ++i;
            return [3 /*break*/, 1];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  }

  /*
   * Taken from https://github.com/karanlyons/murmurHash3.js/blob/a33d0723127e2e5415056c455f8aed2451ace208/murmurHash3.js
   */
  //
  // Given two 64bit ints (as an array of two 32bit ints) returns the two
  // added together as a 64bit int (as an array of two 32bit ints).
  //
  function x64Add(m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] + n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] + n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] + n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] + n[0];
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
  }
  //
  // Given two 64bit ints (as an array of two 32bit ints) returns the two
  // multiplied together as a 64bit int (as an array of two 32bit ints).
  //
  function x64Multiply(m, n) {
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] * n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] * n[3];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[2] += m[3] * n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] * n[3];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[2] * n[2];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[3] * n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0];
    o[0] &= 0xffff;
    return [(o[0] << 16) | o[1], (o[2] << 16) | o[3]];
  }
  //
  // Given a 64bit int (as an array of two 32bit ints) and an int
  // representing a number of bit positions, returns the 64bit int (as an
  // array of two 32bit ints) rotated left by that number of positions.
  //
  function x64Rotl(m, n) {
    n %= 64;
    if (n === 32) {
      return [m[1], m[0]];
    } else if (n < 32) {
      return [
        (m[0] << n) | (m[1] >>> (32 - n)),
        (m[1] << n) | (m[0] >>> (32 - n)),
      ];
    } else {
      n -= 32;
      return [
        (m[1] << n) | (m[0] >>> (32 - n)),
        (m[0] << n) | (m[1] >>> (32 - n)),
      ];
    }
  }
  //
  // Given a 64bit int (as an array of two 32bit ints) and an int
  // representing a number of bit positions, returns the 64bit int (as an
  // array of two 32bit ints) shifted left by that number of positions.
  //
  function x64LeftShift(m, n) {
    n %= 64;
    if (n === 0) {
      return m;
    } else if (n < 32) {
      return [(m[0] << n) | (m[1] >>> (32 - n)), m[1] << n];
    } else {
      return [m[1] << (n - 32), 0];
    }
  }
  //
  // Given two 64bit ints (as an array of two 32bit ints) returns the two
  // xored together as a 64bit int (as an array of two 32bit ints).
  //
  function x64Xor(m, n) {
    return [m[0] ^ n[0], m[1] ^ n[1]];
  }
  //
  // Given a block, returns murmurHash3's final x64 mix of that block.
  // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
  // only place where we need to right shift 64bit ints.)
  //
  function x64Fmix(h) {
    h = x64Xor(h, [0, h[0] >>> 1]);
    h = x64Multiply(h, [0xff51afd7, 0xed558ccd]);
    h = x64Xor(h, [0, h[0] >>> 1]);
    h = x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
    h = x64Xor(h, [0, h[0] >>> 1]);
    return h;
  }
  //
  // Given a string and an optional seed as an int, returns a 128 bit
  // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
  //
  function x64hash128(key, seed) {
    key = key || "";
    seed = seed || 0;
    var remainder = key.length % 16;
    var bytes = key.length - remainder;
    var h1 = [0, seed];
    var h2 = [0, seed];
    var k1 = [0, 0];
    var k2 = [0, 0];
    var c1 = [0x87c37b91, 0x114253d5];
    var c2 = [0x4cf5ad43, 0x2745937f];
    var i;
    for (i = 0; i < bytes; i = i + 16) {
      k1 = [
        (key.charCodeAt(i + 4) & 0xff) |
          ((key.charCodeAt(i + 5) & 0xff) << 8) |
          ((key.charCodeAt(i + 6) & 0xff) << 16) |
          ((key.charCodeAt(i + 7) & 0xff) << 24),
        (key.charCodeAt(i) & 0xff) |
          ((key.charCodeAt(i + 1) & 0xff) << 8) |
          ((key.charCodeAt(i + 2) & 0xff) << 16) |
          ((key.charCodeAt(i + 3) & 0xff) << 24),
      ];
      k2 = [
        (key.charCodeAt(i + 12) & 0xff) |
          ((key.charCodeAt(i + 13) & 0xff) << 8) |
          ((key.charCodeAt(i + 14) & 0xff) << 16) |
          ((key.charCodeAt(i + 15) & 0xff) << 24),
        (key.charCodeAt(i + 8) & 0xff) |
          ((key.charCodeAt(i + 9) & 0xff) << 8) |
          ((key.charCodeAt(i + 10) & 0xff) << 16) |
          ((key.charCodeAt(i + 11) & 0xff) << 24),
      ];
      k1 = x64Multiply(k1, c1);
      k1 = x64Rotl(k1, 31);
      k1 = x64Multiply(k1, c2);
      h1 = x64Xor(h1, k1);
      h1 = x64Rotl(h1, 27);
      h1 = x64Add(h1, h2);
      h1 = x64Add(x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
      k2 = x64Multiply(k2, c2);
      k2 = x64Rotl(k2, 33);
      k2 = x64Multiply(k2, c1);
      h2 = x64Xor(h2, k2);
      h2 = x64Rotl(h2, 31);
      h2 = x64Add(h2, h1);
      h2 = x64Add(x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
    }
    k1 = [0, 0];
    k2 = [0, 0];
    switch (remainder) {
      case 15:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 14)], 48));
      // fallthrough
      case 14:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 13)], 40));
      // fallthrough
      case 13:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 12)], 32));
      // fallthrough
      case 12:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 11)], 24));
      // fallthrough
      case 11:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 10)], 16));
      // fallthrough
      case 10:
        k2 = x64Xor(k2, x64LeftShift([0, key.charCodeAt(i + 9)], 8));
      // fallthrough
      case 9:
        k2 = x64Xor(k2, [0, key.charCodeAt(i + 8)]);
        k2 = x64Multiply(k2, c2);
        k2 = x64Rotl(k2, 33);
        k2 = x64Multiply(k2, c1);
        h2 = x64Xor(h2, k2);
      // fallthrough
      case 8:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 7)], 56));
      // fallthrough
      case 7:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 6)], 48));
      // fallthrough
      case 6:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 5)], 40));
      // fallthrough
      case 5:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 4)], 32));
      // fallthrough
      case 4:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 3)], 24));
      // fallthrough
      case 3:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 2)], 16));
      // fallthrough
      case 2:
        k1 = x64Xor(k1, x64LeftShift([0, key.charCodeAt(i + 1)], 8));
      // fallthrough
      case 1:
        k1 = x64Xor(k1, [0, key.charCodeAt(i)]);
        k1 = x64Multiply(k1, c1);
        k1 = x64Rotl(k1, 31);
        k1 = x64Multiply(k1, c2);
        h1 = x64Xor(h1, k1);
      // fallthrough
    }
    h1 = x64Xor(h1, [0, key.length]);
    h2 = x64Xor(h2, [0, key.length]);
    h1 = x64Add(h1, h2);
    h2 = x64Add(h2, h1);
    h1 = x64Fmix(h1);
    h2 = x64Fmix(h2);
    h1 = x64Add(h1, h2);
    h2 = x64Add(h2, h1);
    return (
      ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) +
      ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) +
      ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) +
      ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8)
    );
  }

  /**
   * Converts an error object to a plain object that can be used with `JSON.stringify`.
   * If you just run `JSON.stringify(error)`, you'll get `'{}'`.
   */
  function errorToObject(error) {
    var _a;
    return __assign(
      {
        name: error.name,
        message: error.message,
        stack:
          (_a = error.stack) === null || _a === void 0
            ? void 0
            : _a.split("\n"),
      },
      error
    );
  }

  /*
   * This file contains functions to work with pure data only (no browser features, DOM, side effects, etc).
   */
  /**
   * Does the same as Array.prototype.includes but has better typing
   */
  function includes(haystack, needle) {
    for (var i = 0, l = haystack.length; i < l; ++i) {
      if (haystack[i] === needle) {
        return true;
      }
    }
    return false;
  }
  /**
   * Like `!includes()` but with proper typing
   */
  function excludes(haystack, needle) {
    return !includes(haystack, needle);
  }
  /**
   * Be careful, NaN can return
   */
  function toInt(value) {
    return parseInt(value);
  }
  /**
   * Be careful, NaN can return
   */
  function toFloat(value) {
    return parseFloat(value);
  }
  function replaceNaN(value, replacement) {
    return typeof value === "number" && isNaN(value) ? replacement : value;
  }
  function countTruthy(values) {
    return values.reduce(function (sum, value) {
      return sum + (value ? 1 : 0);
    }, 0);
  }
  function round(value, base) {
    if (base === void 0) {
      base = 1;
    }
    if (Math.abs(base) >= 1) {
      return Math.round(value / base) * base;
    } else {
      // Sometimes when a number is multiplied by a small number, precision is lost,
      // for example 1234 * 0.0001 === 0.12340000000000001, and it's more precise divide: 1234 / (1 / 0.0001) === 0.1234.
      var counterBase = 1 / base;
      return Math.round(value * counterBase) / counterBase;
    }
  }
  /**
   * Parses a CSS selector into tag name with HTML attributes.
   * Only single element selector are supported (without operators like space, +, >, etc).
   *
   * Multiple values can be returned for each attribute. You decide how to handle them.
   */
  function parseSimpleCssSelector(selector) {
    var _a, _b;
    var errorMessage = "Unexpected syntax '" + selector + "'";
    var tagMatch = /^\s*([a-z-]*)(.*)$/i.exec(selector);
    var tag = tagMatch[1] || undefined;
    var attributes = {};
    var partsRegex = /([.:#][\w-]+|\[.+?\])/gi;
    var addAttribute = function (name, value) {
      attributes[name] = attributes[name] || [];
      attributes[name].push(value);
    };
    for (;;) {
      var match = partsRegex.exec(tagMatch[2]);
      if (!match) {
        break;
      }
      var part = match[0];
      switch (part[0]) {
        case ".":
          addAttribute("class", part.slice(1));
          break;
        case "#":
          addAttribute("id", part.slice(1));
          break;
        case "[": {
          var attributeMatch =
            /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(part);
          if (attributeMatch) {
            addAttribute(
              attributeMatch[1],
              (_b =
                (_a = attributeMatch[4]) !== null && _a !== void 0
                  ? _a
                  : attributeMatch[5]) !== null && _b !== void 0
                ? _b
                : ""
            );
          } else {
            throw new Error(errorMessage);
          }
          break;
        }
        default:
          throw new Error(errorMessage);
      }
    }
    return [tag, attributes];
  }

  function ensureErrorWithMessage(error) {
    return error && typeof error === "object" && "message" in error
      ? error
      : { message: error };
  }
  /**
   * Loads the given entropy source. Returns a function that gets an entropy component from the source.
   *
   * The result is returned synchronously to prevent `loadSources` from
   * waiting for one source to load before getting the components from the other sources.
   */
  function loadSource(source, sourceOptions) {
    var isFinalResultLoaded = function (loadResult) {
      return typeof loadResult !== "function";
    };
    var sourceLoadPromise = new Promise(function (resolveLoad) {
      var loadStartTime = Date.now();
      // `awaitIfAsync` is used instead of just `await` in order to measure the duration of synchronous sources
      // correctly (other microtasks won't affect the duration).
      awaitIfAsync(source.bind(null, sourceOptions), function () {
        var loadArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          loadArgs[_i] = arguments[_i];
        }
        var loadDuration = Date.now() - loadStartTime;
        // Source loading failed
        if (!loadArgs[0]) {
          return resolveLoad(function () {
            return {
              error: ensureErrorWithMessage(loadArgs[1]),
              duration: loadDuration,
            };
          });
        }
        var loadResult = loadArgs[1];
        // Source loaded with the final result
        if (isFinalResultLoaded(loadResult)) {
          return resolveLoad(function () {
            return { value: loadResult, duration: loadDuration };
          });
        }
        // Source loaded with "get" stage
        resolveLoad(function () {
          return new Promise(function (resolveGet) {
            var getStartTime = Date.now();
            awaitIfAsync(loadResult, function () {
              var getArgs = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                getArgs[_i] = arguments[_i];
              }
              var duration = loadDuration + Date.now() - getStartTime;
              // Source getting failed
              if (!getArgs[0]) {
                return resolveGet({
                  error: ensureErrorWithMessage(getArgs[1]),
                  duration: duration,
                });
              }
              // Source getting succeeded
              resolveGet({ value: getArgs[1], duration: duration });
            });
          });
        });
      });
    });
    return function getComponent() {
      return sourceLoadPromise.then(function (finalizeSource) {
        return finalizeSource();
      });
    };
  }
  /**
   * Loads the given entropy sources. Returns a function that collects the entropy components.
   *
   * The result is returned synchronously in order to allow start getting the components
   * before the sources are loaded completely.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function loadSources(sources, sourceOptions, excludeSources) {
    var includedSources = Object.keys(sources).filter(function (sourceKey) {
      return excludes(excludeSources, sourceKey);
    });
    var sourceGetters = Array(includedSources.length);
    // Using `forEachWithBreaks` allows asynchronous sources to complete between synchronous sources
    // and measure the duration correctly
    forEachWithBreaks(includedSources, function (sourceKey, index) {
      sourceGetters[index] = loadSource(sources[sourceKey], sourceOptions);
    });
    return function getComponents() {
      return __awaiter(this, void 0, void 0, function () {
        var components,
          _i,
          includedSources_1,
          sourceKey,
          componentPromises,
          _loop_1,
          state_1;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              components = {};
              for (
                _i = 0, includedSources_1 = includedSources;
                _i < includedSources_1.length;
                _i++
              ) {
                sourceKey = includedSources_1[_i];
                components[sourceKey] = undefined;
              }
              componentPromises = Array(includedSources.length);
              _loop_1 = function () {
                var hasAllComponentPromises;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      hasAllComponentPromises = true;
                      return [
                        4 /*yield*/,
                        forEachWithBreaks(
                          includedSources,
                          function (sourceKey, index) {
                            if (!componentPromises[index]) {
                              // `sourceGetters` may be incomplete at this point of execution because `forEachWithBreaks` is asynchronous
                              if (sourceGetters[index]) {
                                componentPromises[index] = sourceGetters[
                                  index
                                ]().then(function (component) {
                                  return (components[sourceKey] = component);
                                });
                              } else {
                                hasAllComponentPromises = false;
                              }
                            }
                          }
                        ),
                      ];
                    case 1:
                      _a.sent();
                      if (hasAllComponentPromises) {
                        return [2 /*return*/, "break"];
                      }
                      return [4 /*yield*/, wait(1)]; // Lets the source load loop continue
                    case 2:
                      _a.sent(); // Lets the source load loop continue
                      return [2 /*return*/];
                  }
                });
              };
              _a.label = 1;
            case 1:
              return [5 /*yield**/, _loop_1()];
            case 2:
              state_1 = _a.sent();
              if (state_1 === "break") return [3 /*break*/, 4];
              _a.label = 3;
            case 3:
              return [3 /*break*/, 1];
            case 4:
              return [4 /*yield*/, Promise.all(componentPromises)];
            case 5:
              _a.sent();
              return [2 /*return*/, components];
          }
        });
      });
    };
  }

  /*
   * Functions to help with features that vary through browsers
   */
  /**
   * Checks whether the browser is based on Trident (the Internet Explorer engine) without using user-agent.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isTrident() {
    var w = window;
    var n = navigator;
    // The properties are checked to be in IE 10, IE 11 and not to be in other browsers in October 2020
    return (
      countTruthy([
        "MSCSSMatrix" in w,
        "msSetImmediate" in w,
        "msIndexedDB" in w,
        "msMaxTouchPoints" in n,
        "msPointerEnabled" in n,
      ]) >= 4
    );
  }
  /**
   * Checks whether the browser is based on EdgeHTML (the pre-Chromium Edge engine) without using user-agent.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isEdgeHTML() {
    // Based on research in October 2020
    var w = window;
    var n = navigator;
    return (
      countTruthy([
        "msWriteProfilerMark" in w,
        "MSStream" in w,
        "msLaunchUri" in n,
        "msSaveBlob" in n,
      ]) >= 3 && !isTrident()
    );
  }
  /**
   * Checks whether the browser is based on Chromium without using user-agent.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isChromium() {
    // Based on research in October 2020. Tested to detect Chromium 42-86.
    var w = window;
    var n = navigator;
    return (
      countTruthy([
        "webkitPersistentStorage" in n,
        "webkitTemporaryStorage" in n,
        n.vendor.indexOf("Google") === 0,
        "webkitResolveLocalFileSystemURL" in w,
        "BatteryManager" in w,
        "webkitMediaStream" in w,
        "webkitSpeechGrammar" in w,
      ]) >= 5
    );
  }
  /**
   * Checks whether the browser is based on mobile or desktop Safari without using user-agent.
   * All iOS browsers use WebKit (the Safari engine).
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isWebKit() {
    // Based on research in September 2020
    var w = window;
    var n = navigator;
    return (
      countTruthy([
        "ApplePayError" in w,
        "CSSPrimitiveValue" in w,
        "Counter" in w,
        n.vendor.indexOf("Apple") === 0,
        "getStorageUpdates" in n,
        "WebKitMediaKeys" in w,
      ]) >= 4
    );
  }
  /**
   * Checks whether the WebKit browser is a desktop Safari.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isDesktopSafari() {
    var w = window;
    return (
      countTruthy([
        "safari" in w,
        !("DeviceMotionEvent" in w),
        !("ongestureend" in w),
        !("standalone" in navigator),
      ]) >= 3
    );
  }
  /**
   * Checks whether the browser is based on Gecko (Firefox engine) without using user-agent.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isGecko() {
    var _a, _b;
    var w = window;
    // Based on research in September 2020
    return (
      countTruthy([
        "buildID" in navigator,
        "MozAppearance" in
          ((_b =
            (_a = document.documentElement) === null || _a === void 0
              ? void 0
              : _a.style) !== null && _b !== void 0
            ? _b
            : {}),
        "onmozfullscreenchange" in w,
        "mozInnerScreenX" in w,
        "CSSMozDocumentRule" in w,
        "CanvasCaptureMediaStream" in w,
      ]) >= 4
    );
  }
  /**
   * Checks whether the browser is based on Chromium version â‰¥86 without using user-agent.
   * It doesn't check that the browser is based on Chromium, there is a separate function for this.
   */
  function isChromium86OrNewer() {
    // Checked in Chrome 85 vs Chrome 86 both on desktop and Android
    var w = window;
    return (
      countTruthy([
        !("MediaSettingsRange" in w),
        "RTCEncodedAudioFrame" in w,
        "" + w.Intl === "[object Intl]",
        "" + w.Reflect === "[object Reflect]",
      ]) >= 3
    );
  }
  /**
   * Checks whether the browser is based on WebKit version â‰¥606 (Safari â‰¥12) without using user-agent.
   * It doesn't check that the browser is based on WebKit, there is a separate function for this.
   *
   * @link https://en.wikipedia.org/wiki/Safari_version_history#Release_history Safari-WebKit versions map
   */
  function isWebKit606OrNewer() {
    // Checked in Safari 9â€“14
    var w = window;
    return (
      countTruthy([
        "DOMRectList" in w,
        "RTCPeerConnectionIceEvent" in w,
        "SVGGeometryElement" in w,
        "ontransitioncancel" in w,
      ]) >= 3
    );
  }
  /**
   * Checks whether the device is an iPad.
   * It doesn't check that the engine is WebKit and that the WebKit isn't desktop.
   */
  function isIPad() {
    // Checked on:
    // Safari on iPadOS (both mobile and desktop modes): 8, 11, 12, 13, 14
    // Chrome on iPadOS (both mobile and desktop modes): 11, 12, 13, 14
    // Safari on iOS (both mobile and desktop modes): 9, 10, 11, 12, 13, 14
    // Chrome on iOS (both mobile and desktop modes): 9, 10, 11, 12, 13, 14
    // Before iOS 13. Safari tampers the value in "request desktop site" mode since iOS 13.
    if (navigator.platform === "iPad") {
      return true;
    }
    var s = screen;
    var screenRatio = s.width / s.height;
    return (
      countTruthy([
        "MediaSource" in window,
        !!Element.prototype.webkitRequestFullscreen,
        // iPhone 4S that runs iOS 9 matches this. But it won't match the criteria above, so it won't be detected as iPad.
        screenRatio > 0.65 && screenRatio < 1.53,
      ]) >= 2
    );
  }
  /**
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function getFullscreenElement() {
    var d = document;
    return (
      d.fullscreenElement ||
      d.msFullscreenElement ||
      d.mozFullScreenElement ||
      d.webkitFullscreenElement ||
      null
    );
  }
  function exitFullscreen() {
    var d = document;
    // `call` is required because the function throws an error without a proper "this" context
    return (
      d.exitFullscreen ||
      d.msExitFullscreen ||
      d.mozCancelFullScreen ||
      d.webkitExitFullscreen
    ).call(d);
  }
  /**
   * Checks whether the device runs on Android without using user-agent.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function isAndroid() {
    var isItChromium = isChromium();
    var isItGecko = isGecko();
    // Only 2 browser engines are presented on Android.
    // Actually, there is also Android 4.1 browser, but it's not worth detecting it at the moment.
    if (!isItChromium && !isItGecko) {
      return false;
    }
    var w = window;
    // Chrome removes all words "Android" from `navigator` when desktop version is requested
    // Firefox keeps "Android" in `navigator.appVersion` when desktop version is requested
    return (
      countTruthy([
        "onorientationchange" in w,
        "orientation" in w,
        isItChromium && !("SharedWorker" in w),
        isItGecko && /android/i.test(navigator.appVersion),
      ]) >= 2
    );
  }

  /**
   * A deep description: https://fingerprintjs.com/blog/audio-fingerprinting/
   * Inspired by and based on https://github.com/cozylife/audio-fingerprint
   */
  function getAudioFingerprint() {
    var w = window;
    var AudioContext = w.OfflineAudioContext || w.webkitOfflineAudioContext;
    if (!AudioContext) {
      return -2 /* NotSupported */;
    }
    // In some browsers, audio context always stays suspended unless the context is started in response to a user action
    // (e.g. a click or a tap). It prevents audio fingerprint from being taken at an arbitrary moment of time.
    // Such browsers are old and unpopular, so the audio fingerprinting is just skipped in them.
    // See a similar case explanation at https://stackoverflow.com/questions/46363048/onaudioprocess-not-called-on-ios11#46534088
    if (doesCurrentBrowserSuspendAudioContext()) {
      return -1 /* KnownToSuspend */;
    }
    var hashFromIndex = 4500;
    var hashToIndex = 5000;
    var context = new AudioContext(1, hashToIndex, 44100);
    var oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.value = 10000;
    var compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;
    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);
    var _a = startRenderingAudio(context),
      renderPromise = _a[0],
      finishRendering = _a[1];
    var fingerprintPromise = renderPromise.then(
      function (buffer) {
        return getHash(buffer.getChannelData(0).subarray(hashFromIndex));
      },
      function (error) {
        if (
          error.name === "timeout" /* Timeout */ ||
          error.name === "suspended" /* Suspended */
        ) {
          return -3 /* Timeout */;
        }
        throw error;
      }
    );
    // Suppresses the console error message in case when the fingerprint fails before requested
    fingerprintPromise.catch(function () {
      return undefined;
    });
    return function () {
      finishRendering();
      return fingerprintPromise;
    };
  }
  /**
   * Checks if the current browser is known to always suspend audio context
   */
  function doesCurrentBrowserSuspendAudioContext() {
    return isWebKit() && !isDesktopSafari() && !isWebKit606OrNewer();
  }
  /**
   * Starts rendering the audio context.
   * When the returned function is called, the render process starts finishing.
   */
  function startRenderingAudio(context) {
    var renderTryMaxCount = 3;
    var renderRetryDelay = 500;
    var runningMaxAwaitTime = 500;
    var runningSufficientTime = 5000;
    var finalize = function () {
      return undefined;
    };
    var resultPromise = new Promise(function (resolve, reject) {
      var isFinalized = false;
      var renderTryCount = 0;
      var startedRunningAt = 0;
      context.oncomplete = function (event) {
        return resolve(event.renderedBuffer);
      };
      var startRunningTimeout = function () {
        setTimeout(function () {
          return reject(makeInnerError("timeout" /* Timeout */));
        }, Math.min(
          runningMaxAwaitTime,
          startedRunningAt + runningSufficientTime - Date.now()
        ));
      };
      var tryRender = function () {
        try {
          context.startRendering();
          switch (context.state) {
            case "running":
              startedRunningAt = Date.now();
              if (isFinalized) {
                startRunningTimeout();
              }
              break;
            // Sometimes the audio context doesn't start after calling `startRendering` (in addition to the cases where
            // audio context doesn't start at all). A known case is starting an audio context when the browser tab is in
            // background on iPhone. Retries usually help in this case.
            case "suspended":
              // The audio context can reject starting until the tab is in foreground. Long fingerprint duration
              // in background isn't a problem, therefore the retry attempts don't count in background. It can lead to
              // a situation when a fingerprint takes very long time and finishes successfully. FYI, the audio context
              // can be suspended when `document.hidden === false` and start running after a retry.
              if (!document.hidden) {
                renderTryCount++;
              }
              if (isFinalized && renderTryCount >= renderTryMaxCount) {
                reject(makeInnerError("suspended" /* Suspended */));
              } else {
                setTimeout(tryRender, renderRetryDelay);
              }
              break;
          }
        } catch (error) {
          reject(error);
        }
      };
      tryRender();
      finalize = function () {
        if (!isFinalized) {
          isFinalized = true;
          if (startedRunningAt > 0) {
            startRunningTimeout();
          }
        }
      };
    });
    return [resultPromise, finalize];
  }
  function getHash(signal) {
    var hash = 0;
    for (var i = 0; i < signal.length; ++i) {
      hash += Math.abs(signal[i]);
    }
    return hash;
  }
  function makeInnerError(name) {
    var error = new Error(name);
    error.name = name;
    return error;
  }

  /**
   * Creates and keeps an invisible iframe while the given function runs.
   * The given function is called when the iframe is loaded and has a body.
   * The iframe allows to measure DOM sizes inside itself.
   *
   * Notice: passing an initial HTML code doesn't work in IE.
   *
   * Warning for package users:
   * This function is out of Semantic Versioning, i.e. can change unexpectedly. Usage is at your own risk.
   */
  function withIframe(action, initialHtml, domPollInterval) {
    var _a, _b, _c;
    if (domPollInterval === void 0) {
      domPollInterval = 50;
    }
    return __awaiter(this, void 0, void 0, function () {
      var d, iframe;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            d = document;
            _d.label = 1;
          case 1:
            if (!!d.body) return [3 /*break*/, 3];
            return [4 /*yield*/, wait(domPollInterval)];
          case 2:
            _d.sent();
            return [3 /*break*/, 1];
          case 3:
            iframe = d.createElement("iframe");
            _d.label = 4;
          case 4:
            _d.trys.push([4, , 10, 11]);
            return [
              4 /*yield*/,
              new Promise(function (_resolve, _reject) {
                var isComplete = false;
                var resolve = function () {
                  isComplete = true;
                  _resolve();
                };
                var reject = function (error) {
                  isComplete = true;
                  _reject(error);
                };
                iframe.onload = resolve;
                iframe.onerror = reject;
                var style = iframe.style;
                style.setProperty("display", "block", "important"); // Required for browsers to calculate the layout
                style.position = "absolute";
                style.top = "0";
                style.left = "0";
                style.visibility = "hidden";
                if (initialHtml && "srcdoc" in iframe) {
                  iframe.srcdoc = initialHtml;
                } else {
                  iframe.src = "about:blank";
                }
                d.body.appendChild(iframe);
                // WebKit in WeChat doesn't fire the iframe's `onload` for some reason.
                // This code checks for the loading state manually.
                // See https://github.com/fingerprintjs/fingerprintjs/issues/645
                var checkReadyState = function () {
                  var _a, _b;
                  // The ready state may never become 'complete' in Firefox despite the 'load' event being fired.
                  // So an infinite setTimeout loop can happen without this check.
                  // See https://github.com/fingerprintjs/fingerprintjs/pull/716#issuecomment-986898796
                  if (isComplete) {
                    return;
                  }
                  // Make sure iframe.contentWindow and iframe.contentWindow.document are both loaded
                  // The contentWindow.document can miss in JSDOM (https://github.com/jsdom/jsdom).
                  if (
                    ((_b =
                      (_a = iframe.contentWindow) === null || _a === void 0
                        ? void 0
                        : _a.document) === null || _b === void 0
                      ? void 0
                      : _b.readyState) === "complete"
                  ) {
                    resolve();
                  } else {
                    setTimeout(checkReadyState, 10);
                  }
                };
                checkReadyState();
              }),
            ];
          case 5:
            _d.sent();
            _d.label = 6;
          case 6:
            if (
              !!((_b =
                (_a = iframe.contentWindow) === null || _a === void 0
                  ? void 0
                  : _a.document) === null || _b === void 0
                ? void 0
                : _b.body)
            )
              return [3 /*break*/, 8];
            return [4 /*yield*/, wait(domPollInterval)];
          case 7:
            _d.sent();
            return [3 /*break*/, 6];
          case 8:
            return [4 /*yield*/, action(iframe, iframe.contentWindow)];
          case 9:
            return [2 /*return*/, _d.sent()];
          case 10:
            (_c = iframe.parentNode) === null || _c === void 0
              ? void 0
              : _c.removeChild(iframe);
            return [7 /*endfinally*/];
          case 11:
            return [2 /*return*/];
        }
      });
    });
  }
  /**
   * Creates a DOM element that matches the given selector.
   * Only single element selector are supported (without operators like space, +, >, etc).
   */
  function selectorToElement(selector) {
    var _a = parseSimpleCssSelector(selector),
      tag = _a[0],
      attributes = _a[1];
    var element = document.createElement(
      tag !== null && tag !== void 0 ? tag : "div"
    );
    for (var _i = 0, _b = Object.keys(attributes); _i < _b.length; _i++) {
      var name_1 = _b[_i];
      element.setAttribute(name_1, attributes[name_1].join(" "));
    }
    return element;
  }

  // We use m or w because these two characters take up the maximum width.
  // And we use a LLi so that the same matching fonts can get separated.
  var testString = "mmMwWLliI0O&1";
  // We test using 48px font size, we may use any size. I guess larger the better.
  var textSize = "48px";
  // A font will be compared against all the three default fonts.
  // And if for any default fonts it doesn't match, then that font is available.
  var baseFonts = ["monospace", "sans-serif", "serif"];
  var fontList = [
    // This is android-specific font from "Roboto" family
    "sans-serif-thin",
    "ARNO PRO",
    "Agency FB",
    "Arabic Typesetting",
    "Arial Unicode MS",
    "AvantGarde Bk BT",
    "BankGothic Md BT",
    "Batang",
    "Bitstream Vera Sans Mono",
    "Calibri",
    "Century",
    "Century Gothic",
    "Clarendon",
    "EUROSTILE",
    "Franklin Gothic",
    "Futura Bk BT",
    "Futura Md BT",
    "GOTHAM",
    "Gill Sans",
    "HELV",
    "Haettenschweiler",
    "Helvetica Neue",
    "Humanst521 BT",
    "Leelawadee",
    "Letter Gothic",
    "Levenim MT",
    "Lucida Bright",
    "Lucida Sans",
    "Menlo",
    "MS Mincho",
    "MS Outlook",
    "MS Reference Specialty",
    "MS UI Gothic",
    "MT Extra",
    "MYRIAD PRO",
    "Marlett",
    "Meiryo UI",
    "Microsoft Uighur",
    "Minion Pro",
    "Monotype Corsiva",
    "PMingLiU",
    "Pristina",
    "SCRIPTINA",
    "Segoe UI Light",
    "Serifa",
    "SimHei",
    "Small Fonts",
    "Staccato222 BT",
    "TRAJAN PRO",
    "Univers CE 55 Medium",
    "Vrinda",
    "ZWAdobeF",
  ];
  // kudos to http://www.lalit.org/lab/javascript-css-font-detect/
  function getFonts() {
    // Running the script in an iframe makes it not affect the page look and not be affected by the page CSS. See:
    // https://github.com/fingerprintjs/fingerprintjs/issues/592
    // https://github.com/fingerprintjs/fingerprintjs/issues/628
    return withIframe(function (_, _a) {
      var document = _a.document;
      var holder = document.body;
      holder.style.fontSize = textSize;
      // div to load spans for the default fonts and the fonts to detect
      var spansContainer = document.createElement("div");
      var defaultWidth = {};
      var defaultHeight = {};
      // creates a span where the fonts will be loaded
      var createSpan = function (fontFamily) {
        var span = document.createElement("span");
        var style = span.style;
        style.position = "absolute";
        style.top = "0";
        style.left = "0";
        style.fontFamily = fontFamily;
        span.textContent = testString;
        spansContainer.appendChild(span);
        return span;
      };
      // creates a span and load the font to detect and a base font for fallback
      var createSpanWithFonts = function (fontToDetect, baseFont) {
        return createSpan("'" + fontToDetect + "'," + baseFont);
      };
      // creates spans for the base fonts and adds them to baseFontsDiv
      var initializeBaseFontsSpans = function () {
        return baseFonts.map(createSpan);
      };
      // creates spans for the fonts to detect and adds them to fontsDiv
      var initializeFontsSpans = function () {
        // Stores {fontName : [spans for that font]}
        var spans = {};
        var _loop_1 = function (font) {
          spans[font] = baseFonts.map(function (baseFont) {
            return createSpanWithFonts(font, baseFont);
          });
        };
        for (var _i = 0, fontList_1 = fontList; _i < fontList_1.length; _i++) {
          var font = fontList_1[_i];
          _loop_1(font);
        }
        return spans;
      };
      // checks if a font is available
      var isFontAvailable = function (fontSpans) {
        return baseFonts.some(function (baseFont, baseFontIndex) {
          return (
            fontSpans[baseFontIndex].offsetWidth !== defaultWidth[baseFont] ||
            fontSpans[baseFontIndex].offsetHeight !== defaultHeight[baseFont]
          );
        });
      };
      // create spans for base fonts
      var baseFontsSpans = initializeBaseFontsSpans();
      // create spans for fonts to detect
      var fontsSpans = initializeFontsSpans();
      // add all the spans to the DOM
      holder.appendChild(spansContainer);
      // get the default width for the three base fonts
      for (var index = 0; index < baseFonts.length; index++) {
        defaultWidth[baseFonts[index]] = baseFontsSpans[index].offsetWidth; // width for the default font
        defaultHeight[baseFonts[index]] = baseFontsSpans[index].offsetHeight; // height for the default font
      }
      // check available fonts
      return fontList.filter(function (font) {
        return isFontAvailable(fontsSpans[font]);
      });
    });
  }

  function getPlugins() {
    var rawPlugins = navigator.plugins;
    if (!rawPlugins) {
      return undefined;
    }
    var plugins = [];
    // Safari 10 doesn't support iterating navigator.plugins with for...of
    for (var i = 0; i < rawPlugins.length; ++i) {
      var plugin = rawPlugins[i];
      if (!plugin) {
        continue;
      }
      var mimeTypes = [];
      for (var j = 0; j < plugin.length; ++j) {
        var mimeType = plugin[j];
        mimeTypes.push({
          type: mimeType.type,
          suffixes: mimeType.suffixes,
        });
      }
      plugins.push({
        name: plugin.name,
        description: plugin.description,
        mimeTypes: mimeTypes,
      });
    }
    return plugins;
  }

  // https://www.browserleaks.com/canvas#how-does-it-work
  function getCanvasFingerprint() {
    var _a = makeCanvasContext(),
      canvas = _a[0],
      context = _a[1];
    if (!isSupported(canvas, context)) {
      return { winding: false, geometry: "", text: "" };
    }
    return {
      winding: doesSupportWinding(context),
      geometry: makeGeometryImage(canvas, context),
      // Text is unstable:
      // https://github.com/fingerprintjs/fingerprintjs/issues/583
      // https://github.com/fingerprintjs/fingerprintjs/issues/103
      // Therefore it's extracted into a separate image.
      text: makeTextImage(canvas, context),
    };
  }
  function makeCanvasContext() {
    var canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return [canvas, canvas.getContext("2d")];
  }
  function isSupported(canvas, context) {
    // TODO: look into: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
    return !!(context && canvas.toDataURL);
  }
  function doesSupportWinding(context) {
    // https://web.archive.org/web/20170825024655/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas/winding.js
    context.rect(0, 0, 10, 10);
    context.rect(2, 2, 6, 6);
    return !context.isPointInPath(5, 5, "evenodd");
  }
  function makeTextImage(canvas, context) {
    // Resizing the canvas cleans it
    canvas.width = 240;
    canvas.height = 60;
    context.textBaseline = "alphabetic";
    context.fillStyle = "#f60";
    context.fillRect(100, 1, 62, 20);
    context.fillStyle = "#069";
    // It's important to use explicit built-in fonts in order to exclude the affect of font preferences
    // (there is a separate entropy source for them).
    context.font = '11pt "Times New Roman"';
    // The choice of emojis has a gigantic impact on rendering performance (especially in FF).
    // Some newer emojis cause it to slow down 50-200 times.
    // There must be no text to the right of the emoji, see https://github.com/fingerprintjs/fingerprintjs/issues/574
    // A bare emoji shouldn't be used because the canvas will change depending on the script encoding:
    // https://github.com/fingerprintjs/fingerprintjs/issues/66
    // Escape sequence shouldn't be used too because Terser will turn it into a bare unicode.
    var printedText =
      "Cwm fjordbank gly " + String.fromCharCode(55357, 56835); /* ðŸ˜ƒ */
    context.fillText(printedText, 2, 15);
    context.fillStyle = "rgba(102, 204, 0, 0.2)";
    context.font = "18pt Arial";
    context.fillText(printedText, 4, 45);
    return save(canvas);
  }
  function makeGeometryImage(canvas, context) {
    // Resizing the canvas cleans it
    canvas.width = 122;
    canvas.height = 110;
    // Canvas blending
    // https://web.archive.org/web/20170826194121/http://blogs.adobe.com/webplatform/2013/01/28/blending-features-in-canvas/
    // http://jsfiddle.net/NDYV8/16/
    context.globalCompositeOperation = "multiply";
    for (
      var _i = 0,
        _a = [
          ["#f2f", 40, 40],
          ["#2ff", 80, 40],
          ["#ff2", 60, 80],
        ];
      _i < _a.length;
      _i++
    ) {
      var _b = _a[_i],
        color = _b[0],
        x = _b[1],
        y = _b[2];
      context.fillStyle = color;
      context.beginPath();
      context.arc(x, y, 40, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    }
    // Canvas winding
    // https://web.archive.org/web/20130913061632/http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/
    // http://jsfiddle.net/NDYV8/19/
    context.fillStyle = "#f9c";
    context.arc(60, 60, 60, 0, Math.PI * 2, true);
    context.arc(60, 60, 20, 0, Math.PI * 2, true);
    context.fill("evenodd");
    return save(canvas);
  }
  function save(canvas) {
    // TODO: look into: https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
    return canvas.toDataURL();
  }

  /**
   * This is a crude and primitive touch screen detection. It's not possible to currently reliably detect the availability
   * of a touch screen with a JS, without actually subscribing to a touch event.
   *
   * @see http://www.stucox.com/blog/you-cant-detect-a-touchscreen/
   * @see https://github.com/Modernizr/Modernizr/issues/548
   */
  function getTouchSupport() {
    var n = navigator;
    var maxTouchPoints = 0;
    var touchEvent;
    if (n.maxTouchPoints !== undefined) {
      maxTouchPoints = toInt(n.maxTouchPoints);
    } else if (n.msMaxTouchPoints !== undefined) {
      maxTouchPoints = n.msMaxTouchPoints;
    }
    try {
      document.createEvent("TouchEvent");
      touchEvent = true;
    } catch (_a) {
      touchEvent = false;
    }
    var touchStart = "ontouchstart" in window;
    return {
      maxTouchPoints: maxTouchPoints,
      touchEvent: touchEvent,
      touchStart: touchStart,
    };
  }

  function getOsCpu() {
    return navigator.oscpu;
  }

  function getLanguages() {
    var n = navigator;
    var result = [];
    var language =
      n.language || n.userLanguage || n.browserLanguage || n.systemLanguage;
    if (language !== undefined) {
      result.push([language]);
    }
    if (Array.isArray(n.languages)) {
      // Starting from Chromium 86, there is only a single value in `navigator.language` in Incognito mode:
      // the value of `navigator.language`. Therefore the value is ignored in this browser.
      if (!(isChromium() && isChromium86OrNewer())) {
        result.push(n.languages);
      }
    } else if (typeof n.languages === "string") {
      var languages = n.languages;
      if (languages) {
        result.push(languages.split(","));
      }
    }
    return result;
  }

  function getColorDepth() {
    return window.screen.colorDepth;
  }

  function getDeviceMemory() {
    // `navigator.deviceMemory` is a string containing a number in some unidentified cases
    return replaceNaN(toFloat(navigator.deviceMemory), undefined);
  }

  function getScreenResolution() {
    var s = screen;
    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    // Some browsers even return  screen resolution as not numbers.
    var parseDimension = function (value) {
      return replaceNaN(toInt(value), null);
    };
    var dimensions = [parseDimension(s.width), parseDimension(s.height)];
    dimensions.sort().reverse();
    return dimensions;
  }

  var screenFrameCheckInterval = 2500;
  var roundingPrecision = 10;
  // The type is readonly to protect from unwanted mutations
  var screenFrameBackup;
  var screenFrameSizeTimeoutId;
  /**
   * Starts watching the screen frame size. When a non-zero size appears, the size is saved and the watch is stopped.
   * Later, when `getScreenFrame` runs, it will return the saved non-zero size if the current size is null.
   *
   * This trick is required to mitigate the fact that the screen frame turns null in some cases.
   * See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
   */
  function watchScreenFrame() {
    if (screenFrameSizeTimeoutId !== undefined) {
      return;
    }
    var checkScreenFrame = function () {
      var frameSize = getCurrentScreenFrame();
      if (isFrameSizeNull(frameSize)) {
        screenFrameSizeTimeoutId = setTimeout(
          checkScreenFrame,
          screenFrameCheckInterval
        );
      } else {
        screenFrameBackup = frameSize;
        screenFrameSizeTimeoutId = undefined;
      }
    };
    checkScreenFrame();
  }
  function getScreenFrame() {
    var _this = this;
    watchScreenFrame();
    return function () {
      return __awaiter(_this, void 0, void 0, function () {
        var frameSize;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              frameSize = getCurrentScreenFrame();
              if (!isFrameSizeNull(frameSize)) return [3 /*break*/, 2];
              if (screenFrameBackup) {
                return [2 /*return*/, __spreadArrays(screenFrameBackup)];
              }
              if (!getFullscreenElement()) return [3 /*break*/, 2];
              // Some browsers set the screen frame to zero when programmatic fullscreen is on.
              // There is a chance of getting a non-zero frame after exiting the fullscreen.
              // See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
              return [4 /*yield*/, exitFullscreen()];
            case 1:
              // Some browsers set the screen frame to zero when programmatic fullscreen is on.
              // There is a chance of getting a non-zero frame after exiting the fullscreen.
              // See more on this at https://github.com/fingerprintjs/fingerprintjs/issues/568
              _a.sent();
              frameSize = getCurrentScreenFrame();
              _a.label = 2;
            case 2:
              if (!isFrameSizeNull(frameSize)) {
                screenFrameBackup = frameSize;
              }
              return [2 /*return*/, frameSize];
          }
        });
      });
    };
  }
  /**
   * Sometimes the available screen resolution changes a bit, e.g. 1900x1440 â†’ 1900x1439. A possible reason: macOS Dock
   * shrinks to fit more icons when there is too little space. The rounding is used to mitigate the difference.
   */
  function getRoundedScreenFrame() {
    var _this = this;
    var screenFrameGetter = getScreenFrame();
    return function () {
      return __awaiter(_this, void 0, void 0, function () {
        var frameSize, processSize;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, screenFrameGetter()];
            case 1:
              frameSize = _a.sent();
              processSize = function (sideSize) {
                return sideSize === null
                  ? null
                  : round(sideSize, roundingPrecision);
              };
              // It might look like I don't know about `for` and `map`.
              // In fact, such code is used to avoid TypeScript issues without using `as`.
              return [
                2 /*return*/,
                [
                  processSize(frameSize[0]),
                  processSize(frameSize[1]),
                  processSize(frameSize[2]),
                  processSize(frameSize[3]),
                ],
              ];
          }
        });
      });
    };
  }
  function getCurrentScreenFrame() {
    var s = screen;
    // Some browsers return screen resolution as strings, e.g. "1200", instead of a number, e.g. 1200.
    // I suspect it's done by certain plugins that randomize browser properties to prevent fingerprinting.
    //
    // Some browsers (IE, Edge â‰¤18) don't provide `screen.availLeft` and `screen.availTop`. The property values are
    // replaced with 0 in such cases to not lose the entropy from `screen.availWidth` and `screen.availHeight`.
    return [
      replaceNaN(toFloat(s.availTop), null),
      replaceNaN(
        toFloat(s.width) -
          toFloat(s.availWidth) -
          replaceNaN(toFloat(s.availLeft), 0),
        null
      ),
      replaceNaN(
        toFloat(s.height) -
          toFloat(s.availHeight) -
          replaceNaN(toFloat(s.availTop), 0),
        null
      ),
      replaceNaN(toFloat(s.availLeft), null),
    ];
  }
  function isFrameSizeNull(frameSize) {
    for (var i = 0; i < 4; ++i) {
      if (frameSize[i]) {
        return false;
      }
    }
    return true;
  }

  function getHardwareConcurrency() {
    // sometimes hardware concurrency is a string
    return replaceNaN(toInt(navigator.hardwareConcurrency), undefined);
  }

  function getTimezone() {
    var _a;
    var DateTimeFormat =
      (_a = window.Intl) === null || _a === void 0 ? void 0 : _a.DateTimeFormat;
    if (DateTimeFormat) {
      var timezone = new DateTimeFormat().resolvedOptions().timeZone;
      if (timezone) {
        return timezone;
      }
    }
    // For browsers that don't support timezone names
    // The minus is intentional because the JS offset is opposite to the real offset
    var offset = -getTimezoneOffset();
    return "UTC" + (offset >= 0 ? "+" : "") + Math.abs(offset);
  }
  function getTimezoneOffset() {
    var currentYear = new Date().getFullYear();
    // The timezone offset may change over time due to daylight saving time (DST) shifts.
    // The non-DST timezone offset is used as the result timezone offset.
    // Since the DST season differs in the northern and the southern hemispheres,
    // both January and July timezones offsets are considered.
    return Math.max(
      // `getTimezoneOffset` returns a number as a string in some unidentified cases
      toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()),
      toFloat(new Date(currentYear, 6, 1).getTimezoneOffset())
    );
  }

  function getSessionStorage() {
    try {
      return !!window.sessionStorage;
    } catch (error) {
      /* SecurityError when referencing it means it exists */
      return true;
    }
  }

  // https://bugzilla.mozilla.org/show_bug.cgi?id=781447
  function getLocalStorage() {
    try {
      return !!window.localStorage;
    } catch (e) {
      /* SecurityError when referencing it means it exists */
      return true;
    }
  }

  function getIndexedDB() {
    // IE and Edge don't allow accessing indexedDB in private mode, therefore IE and Edge will have different
    // visitor identifier in normal and private modes.
    if (isTrident() || isEdgeHTML()) {
      return undefined;
    }
    try {
      return !!window.indexedDB;
    } catch (e) {
      /* SecurityError when referencing it means it exists */
      return true;
    }
  }

  function getOpenDatabase() {
    return !!window.openDatabase;
  }

  function getCpuClass() {
    return navigator.cpuClass;
  }

  function getPlatform() {
    // Android Chrome 86 and 87 and Android Firefox 80 and 84 don't mock the platform value when desktop mode is requested
    var platform = navigator.platform;
    // iOS mocks the platform value when desktop version is requested: https://github.com/fingerprintjs/fingerprintjs/issues/514
    // iPad uses desktop mode by default since iOS 13
    // The value is 'MacIntel' on M1 Macs
    // The value is 'iPhone' on iPod Touch
    if (platform === "MacIntel") {
      if (isWebKit() && !isDesktopSafari()) {
        return isIPad() ? "iPad" : "iPhone";
      }
    }
    return platform;
  }

  function getVendor() {
    return navigator.vendor || "";
  }

  /**
   * Checks for browser-specific (not engine specific) global variables to tell browsers with the same engine apart.
   * Only somewhat popular browsers are considered.
   */
  function getVendorFlavors() {
    var flavors = [];
    for (
      var _i = 0,
        _a = [
          // Blink and some browsers on iOS
          "chrome",
          // Safari on macOS
          "safari",
          // Chrome on iOS (checked in 85 on 13 and 87 on 14)
          "__crWeb",
          "__gCrWeb",
          // Yandex Browser on iOS, macOS and Android (checked in 21.2 on iOS 14, macOS and Android)
          "yandex",
          // Yandex Browser on iOS (checked in 21.2 on 14)
          "__yb",
          "__ybro",
          // Firefox on iOS (checked in 32 on 14)
          "__firefox__",
          // Edge on iOS (checked in 46 on 14)
          "__edgeTrackingPreventionStatistics",
          "webkit",
          // Opera Touch on iOS (checked in 2.6 on 14)
          "oprt",
          // Samsung Internet on Android (checked in 11.1)
          "samsungAr",
          // UC Browser on Android (checked in 12.10 and 13.0)
          "ucweb",
          "UCShellJava",
          // Puffin on Android (checked in 9.0)
          "puffinDevice",
        ];
      _i < _a.length;
      _i++
    ) {
      var key = _a[_i];
      var value = window[key];
      if (value && typeof value === "object") {
        flavors.push(key);
      }
    }
    return flavors.sort();
  }

  /**
   * navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
   * cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past with
   * site-specific exceptions. Don't rely on it.
   *
   * @see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js Taken from here
   */
  function areCookiesEnabled() {
    var d = document;
    // Taken from here: https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cookies.js
    // navigator.cookieEnabled cannot detect custom or nuanced cookie blocking configurations. For example, when blocking
    // cookies via the Advanced Privacy Settings in IE9, it always returns true. And there have been issues in the past
    // with site-specific exceptions. Don't rely on it.
    // try..catch because some in situations `document.cookie` is exposed but throws a
    // SecurityError if you try to access it; e.g. documents created from data URIs
    // or in sandboxed iframes (depending on flags/context)
    try {
      // Create cookie
      d.cookie = "cookietest=1; SameSite=Strict;";
      var result = d.cookie.indexOf("cookietest=") !== -1;
      // Delete cookie
      d.cookie =
        "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT";
      return result;
    } catch (e) {
      return false;
    }
  }

  /**
   * Only single element selector are supported (no operators like space, +, >, etc).
   * `embed` and `position: fixed;` will be considered as blocked anyway because it always has no offsetParent.
   * Avoid `iframe` and anything with `[src=]` because they produce excess HTTP requests.
   *
   * See docs/content_blockers.md to learn how to make the list
   */
  var filters = {
    abpIndo: [
      "#Iklan-Melayang",
      "#Kolom-Iklan-728",
      "#SidebarIklan-wrapper",
      'a[title="7naga poker" i]',
      '[title="ALIENBOLA" i]',
    ],
    abpvn: [
      "#quangcaomb",
      ".iosAdsiosAds-layout",
      ".quangcao",
      '[href^="https://r88.vn/"]',
      '[href^="https://zbet.vn/"]',
    ],
    adBlockFinland: [
      ".mainostila",
      ".sponsorit",
      ".ylamainos",
      'a[href*="/clickthrgh.asp?"]',
      'a[href^="https://app.readpeak.com/ads"]',
    ],
    adBlockPersian: [
      "#navbar_notice_50",
      'a[href^="http://g1.v.fwmrm.net/ad/"]',
      ".kadr",
      'TABLE[width="140px"]',
      "#divAgahi",
    ],
    adBlockWarningRemoval: [
      "#adblock-honeypot",
      ".adblocker-root",
      ".wp_adblock_detect",
    ],
    adGuardAnnoyances: [
      'amp-embed[type="zen"]',
      ".hs-sosyal",
      "#cookieconsentdiv",
      'div[class^="app_gdpr"]',
      ".as-oil",
    ],
    adGuardBase: [
      "#ad-after",
      "#ad-p3",
      ".BetterJsPopOverlay",
      "#ad_300X250",
      "#bannerfloat22",
    ],
    adGuardChinese: [
      '#piao_div_0[style*="width:140px;"]',
      'a[href*=".ttz5.cn"]',
      'a[href*=".yabovip2027.com/"]',
      ".tm3all2h4b",
      ".cc5278_banner_ad",
    ],
    adGuardFrench: [
      ".zonepub",
      '[class*="_adLeaderboard"]',
      '[id^="block-xiti_oas-"]',
      'a[href^="http://ptapjmp.com/"]',
      'a[href^="https://go.alvexo.com/"]',
    ],
    adGuardGerman: [
      ".banneritemwerbung_head_1",
      ".boxstartwerbung",
      ".werbung3",
      'a[href^="http://www.eis.de/index.phtml?refid="]',
      'a[href^="https://www.tipico.com/?affiliateId="]',
    ],
    adGuardJapanese: [
      "#kauli_yad_1",
      "#ad-giftext",
      "#adsSPRBlock",
      'a[href^="http://ad2.trafficgate.net/"]',
      'a[href^="http://www.rssad.jp/"]',
    ],
    adGuardMobile: [
      "amp-auto-ads",
      "#mgid_iframe",
      ".amp_ad",
      'amp-embed[type="24smi"]',
      "#mgid_iframe1",
    ],
    adGuardRussian: [
      'a[href^="https://ya-distrib.ru/r/"]',
      'a[href^="https://ad.letmeads.com/"]',
      ".reclama",
      'div[id^="smi2adblock"]',
      'div[id^="AdFox_banner_"]',
    ],
    adGuardSocial: [
      'a[href^="//www.stumbleupon.com/submit?url="]',
      'a[href^="//telegram.me/share/url?"]',
      ".etsy-tweet",
      "#inlineShare",
      ".popup-social",
    ],
    adGuardSpanishPortuguese: [
      "#barraPublicidade",
      "#Publicidade",
      "#publiEspecial",
      "#queTooltip",
      '[href^="http://ads.glispa.com/"]',
    ],
    adGuardTrackingProtection: [
      'amp-embed[type="taboola"]',
      "#qoo-counter",
      'a[href^="http://click.hotlog.ru/"]',
      'a[href^="http://hitcounter.ru/top/stat.php"]',
      'a[href^="http://top.mail.ru/jump"]',
    ],
    adGuardTurkish: [
      "#backkapat",
      "#reklami",
      'a[href^="http://adserv.ontek.com.tr/"]',
      'a[href^="http://izlenzi.com/campaign/"]',
      'a[href^="http://www.installads.net/"]',
    ],
    bulgarian: [
      "td#freenet_table_ads",
      "#adbody",
      "#ea_intext_div",
      ".lapni-pop-over",
      "#xenium_hot_offers",
    ],
    easyList: [
      "#AD_banner_bottom",
      "#Ads_google_02",
      "#N-ad-article-rightRail-1",
      "#ad-fullbanner2",
      "#ad-zone-2",
    ],
    easyListChina: [
      'a[href*=".wensixuetang.com/"]',
      'A[href*="/hth107.com/"]',
      '.appguide-wrap[onclick*="bcebos.com"]',
      ".frontpageAdvM",
      "#taotaole",
    ],
    easyListCookie: [
      "#adtoniq-msg-bar",
      "#CoockiesPage",
      "#CookieModal_cookiemodal",
      "#DO_CC_PANEL",
      "#ShowCookie",
    ],
    easyListCzechSlovak: [
      "#onlajny-stickers",
      "#reklamni-box",
      ".reklama-megaboard",
      ".sklik",
      '[id^="sklikReklama"]',
    ],
    easyListDutch: [
      "#advertentie",
      "#vipAdmarktBannerBlock",
      ".adstekst",
      'a[href^="https://xltube.nl/click/"]',
      "#semilo-lrectangle",
    ],
    easyListGermany: [
      'a[href^="http://www.hw-area.com/?dp="]',
      'a[href^="https://ads.sunmaker.com/tracking.php?"]',
      ".werbung-skyscraper2",
      ".bannergroup_werbung",
      ".ads_rechts",
    ],
    easyListItaly: [
      ".box_adv_annunci",
      ".sb-box-pubbliredazionale",
      'a[href^="http://affiliazioniads.snai.it/"]',
      'a[href^="https://adserver.html.it/"]',
      'a[href^="https://affiliazioniads.snai.it/"]',
    ],
    easyListLithuania: [
      ".reklamos_tarpas",
      ".reklamos_nuorodos",
      'img[alt="Reklaminis skydelis"]',
      'img[alt="Dedikuoti.lt serveriai"]',
      'img[alt="Hostingas Serveriai.lt"]',
    ],
    estonian: ['A[href*="http://pay4results24.eu"]'],
    fanboyAnnoyances: [
      "#feedback-tab",
      "#taboola-below-article",
      ".feedburnerFeedBlock",
      ".widget-feedburner-counter",
      '[title="Subscribe to our blog"]',
    ],
    fanboyAntiFacebook: [".util-bar-module-firefly-visible"],
    fanboyEnhancedTrackers: [
      ".open.pushModal",
      "#issuem-leaky-paywall-articles-zero-remaining-nag",
      "#sovrn_container",
      'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
      ".BlockNag__Card",
    ],
    fanboySocial: [
      ".td-tags-and-social-wrapper-box",
      ".twitterContainer",
      ".youtube-social",
      'a[title^="Like us on Facebook"]',
      'img[alt^="Share on Digg"]',
    ],
    frellwitSwedish: [
      'a[href*="casinopro.se"][target="_blank"]',
      'a[href*="doktor-se.onelink.me"]',
      "article.category-samarbete",
      "div.holidAds",
      "ul.adsmodern",
    ],
    greekAdBlock: [
      'A[href*="adman.otenet.gr/click?"]',
      'A[href*="http://axiabanners.exodus.gr/"]',
      'A[href*="http://interactive.forthnet.gr/click?"]',
      "DIV.agores300",
      "TABLE.advright",
    ],
    hungarian: [
      'A[href*="ad.eval.hu"]',
      'A[href*="ad.netmedia.hu"]',
      'A[href*="daserver.ultraweb.hu"]',
      "#cemp_doboz",
      ".optimonk-iframe-container",
    ],
    iDontCareAboutCookies: [
      '.alert-info[data-block-track*="CookieNotice"]',
      ".ModuleTemplateCookieIndicator",
      ".o--cookies--container",
      ".cookie-msg-info-container",
      "#cookies-policy-sticky",
    ],
    icelandicAbp: ['A[href^="/framework/resources/forms/ads.aspx"]'],
    latvian: [
      'a[href="http://www.salidzini.lv/"][style="display: block; width: 120px; height: 40px; overflow: hidden; position: relative;"]',
      'a[href="http://www.salidzini.lv/"][style="display: block; width: 88px; height: 31px; overflow: hidden; position: relative;"]',
    ],
    listKr: [
      'a[href*="//kingtoon.slnk.kr"]',
      'a[href*="//playdsb.com/kr"]',
      "div.logly-lift-adz",
      'div[data-widget_id="ml6EJ074"]',
      "ins.daum_ddn_area",
    ],
    listeAr: [
      ".geminiLB1Ad",
      ".right-and-left-sponsers",
      'a[href*=".aflam.info"]',
      'a[href*="booraq.org"]',
      'a[href*="dubizzle.com/ar/?utm_source="]',
    ],
    listeFr: [
      'a[href^="http://promo.vador.com/"]',
      "#adcontainer_recherche",
      'a[href*="weborama.fr/fcgi-bin/"]',
      ".site-pub-interstitiel",
      'div[id^="crt-"][data-criteo-id]',
    ],
    officialPolish: [
      "#ceneo-placeholder-ceneo-12",
      '[href^="https://aff.sendhub.pl/"]',
      'a[href^="http://advmanager.techfun.pl/redirect/"]',
      'a[href^="http://www.trizer.pl/?utm_source"]',
      "div#skapiec_ad",
    ],
    ro: [
      'a[href^="//afftrk.altex.ro/Counter/Click"]',
      'a[href^="/magazin/"]',
      'a[href^="https://blackfridaysales.ro/trk/shop/"]',
      'a[href^="https://event.2performant.com/events/click"]',
      'a[href^="https://l.profitshare.ro/"]',
    ],
    ruAd: [
      'a[href*="//febrare.ru/"]',
      'a[href*="//utimg.ru/"]',
      'a[href*="://chikidiki.ru"]',
      "#pgeldiz",
      ".yandex-rtb-block",
    ],
    thaiAds: [
      "a[href*=macau-uta-popup]",
      "#ads-google-middle_rectangle-group",
      ".ads300s",
      ".bumq",
      ".img-kosana",
    ],
    webAnnoyancesUltralist: [
      "#mod-social-share-2",
      "#social-tools",
      ".ctpl-fullbanner",
      ".zergnet-recommend",
      ".yt.btn-link.btn-md.btn",
    ],
  };
  /**
   * The order of the returned array means nothing (it's always sorted alphabetically).
   *
   * Notice that the source is slightly unstable.
   * Safari provides a 2-taps way to disable all content blockers on a page temporarily.
   * Also content blockers can be disabled permanently for a domain, but it requires 4 taps.
   * So empty array shouldn't be treated as "no blockers", it should be treated as "no signal".
   * If you are a website owner, don't make your visitors want to disable content blockers.
   */
  function getDomBlockers(_a) {
    var debug = (_a === void 0 ? {} : _a).debug;
    return __awaiter(this, void 0, void 0, function () {
      var filterNames, allSelectors, blockedSelectors, activeBlockers;
      var _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            if (!isApplicable()) {
              return [2 /*return*/, undefined];
            }
            filterNames = Object.keys(filters);
            allSelectors = (_b = []).concat.apply(
              _b,
              filterNames.map(function (filterName) {
                return filters[filterName];
              })
            );
            return [4 /*yield*/, getBlockedSelectors(allSelectors)];
          case 1:
            blockedSelectors = _c.sent();
            if (debug) {
              printDebug(blockedSelectors);
            }
            activeBlockers = filterNames.filter(function (filterName) {
              var selectors = filters[filterName];
              var blockedCount = countTruthy(
                selectors.map(function (selector) {
                  return blockedSelectors[selector];
                })
              );
              return blockedCount > selectors.length * 0.6;
            });
            activeBlockers.sort();
            return [2 /*return*/, activeBlockers];
        }
      });
    });
  }
  function isApplicable() {
    // Safari (desktop and mobile) and all Android browsers keep content blockers in both regular and private mode
    return isWebKit() || isAndroid();
  }
  function getBlockedSelectors(selectors) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
      var d, root, elements, blockedSelectors, i, element, holder, i;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            d = document;
            root = d.createElement("div");
            elements = new Array(selectors.length);
            blockedSelectors = {}; // Set() isn't used just in case somebody need older browser support
            forceShow(root);
            // First create all elements that can be blocked. If the DOM steps below are done in a single cycle,
            // browser will alternate tree modification and layout reading, that is very slow.
            for (i = 0; i < selectors.length; ++i) {
              element = selectorToElement(selectors[i]);
              holder = d.createElement("div"); // Protects from unwanted effects of `+` and `~` selectors of filters
              forceShow(holder);
              holder.appendChild(element);
              root.appendChild(holder);
              elements[i] = element;
            }
            _b.label = 1;
          case 1:
            if (!!d.body) return [3 /*break*/, 3];
            return [4 /*yield*/, wait(50)];
          case 2:
            _b.sent();
            return [3 /*break*/, 1];
          case 3:
            d.body.appendChild(root);
            try {
              // Then check which of the elements are blocked
              for (i = 0; i < selectors.length; ++i) {
                if (!elements[i].offsetParent) {
                  blockedSelectors[selectors[i]] = true;
                }
              }
            } finally {
              // Then remove the elements
              (_a = root.parentNode) === null || _a === void 0
                ? void 0
                : _a.removeChild(root);
            }
            return [2 /*return*/, blockedSelectors];
        }
      });
    });
  }
  function forceShow(element) {
    element.style.setProperty("display", "block", "important");
  }
  function printDebug(blockedSelectors) {
    var message = "DOM blockers debug:\n```";
    for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
      var filterName = _a[_i];
      message += "\n" + filterName + ":";
      for (var _b = 0, _c = filters[filterName]; _b < _c.length; _b++) {
        var selector = _c[_b];
        message +=
          "\n  " +
          selector +
          " " +
          (blockedSelectors[selector] ? "ðŸš«" : "âž¡ï¸");
      }
    }
    // console.log is ok here because it's under a debug clause
    // eslint-disable-next-line no-console
    console.log(message + "\n```");
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/color-gamut
   */
  function getColorGamut() {
    // rec2020 includes p3 and p3 includes srgb
    for (var _i = 0, _a = ["rec2020", "p3", "srgb"]; _i < _a.length; _i++) {
      var gamut = _a[_i];
      if (matchMedia("(color-gamut: " + gamut + ")").matches) {
        return gamut;
      }
    }
    return undefined;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/inverted-colors
   */
  function areColorsInverted() {
    if (doesMatch("inverted")) {
      return true;
    }
    if (doesMatch("none")) {
      return false;
    }
    return undefined;
  }
  function doesMatch(value) {
    return matchMedia("(inverted-colors: " + value + ")").matches;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/forced-colors
   */
  function areColorsForced() {
    if (doesMatch$1("active")) {
      return true;
    }
    if (doesMatch$1("none")) {
      return false;
    }
    return undefined;
  }
  function doesMatch$1(value) {
    return matchMedia("(forced-colors: " + value + ")").matches;
  }

  var maxValueToCheck = 100;
  /**
   * If the display is monochrome (e.g. black&white), the value will be â‰¥0 and will mean the number of bits per pixel.
   * If the display is not monochrome, the returned value will be 0.
   * If the browser doesn't support this feature, the returned value will be undefined.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/monochrome
   */
  function getMonochromeDepth() {
    if (!matchMedia("(min-monochrome: 0)").matches) {
      // The media feature isn't supported by the browser
      return undefined;
    }
    // A variation of binary search algorithm can be used here.
    // But since expected values are very small (â‰¤10), there is no sense in adding the complexity.
    for (var i = 0; i <= maxValueToCheck; ++i) {
      if (matchMedia("(max-monochrome: " + i + ")").matches) {
        return i;
      }
    }
    throw new Error("Too high value");
  }

  /**
   * @see https://www.w3.org/TR/mediaqueries-5/#prefers-contrast
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-contrast
   */
  function getContrastPreference() {
    if (doesMatch$2("no-preference")) {
      return 0 /* None */;
    }
    // The sources contradict on the keywords. Probably 'high' and 'low' will never be implemented.
    // Need to check it when all browsers implement the feature.
    if (doesMatch$2("high") || doesMatch$2("more")) {
      return 1 /* More */;
    }
    if (doesMatch$2("low") || doesMatch$2("less")) {
      return -1 /* Less */;
    }
    if (doesMatch$2("forced")) {
      return 10 /* ForcedColors */;
    }
    return undefined;
  }
  function doesMatch$2(value) {
    return matchMedia("(prefers-contrast: " + value + ")").matches;
  }

  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
   */
  function isMotionReduced() {
    if (doesMatch$3("reduce")) {
      return true;
    }
    if (doesMatch$3("no-preference")) {
      return false;
    }
    return undefined;
  }
  function doesMatch$3(value) {
    return matchMedia("(prefers-reduced-motion: " + value + ")").matches;
  }

  /**
   * @see https://www.w3.org/TR/mediaqueries-5/#dynamic-range
   */
  function isHDR() {
    if (doesMatch$4("high")) {
      return true;
    }
    if (doesMatch$4("standard")) {
      return false;
    }
    return undefined;
  }
  function doesMatch$4(value) {
    return matchMedia("(dynamic-range: " + value + ")").matches;
  }

  var M = Math; // To reduce the minified code size
  var fallbackFn = function () {
    return 0;
  };
  /**
   * @see https://gitlab.torproject.org/legacy/trac/-/issues/13018
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=531915
   */
  function getMathFingerprint() {
    // Native operations
    var acos = M.acos || fallbackFn;
    var acosh = M.acosh || fallbackFn;
    var asin = M.asin || fallbackFn;
    var asinh = M.asinh || fallbackFn;
    var atanh = M.atanh || fallbackFn;
    var atan = M.atan || fallbackFn;
    var sin = M.sin || fallbackFn;
    var sinh = M.sinh || fallbackFn;
    var cos = M.cos || fallbackFn;
    var cosh = M.cosh || fallbackFn;
    var tan = M.tan || fallbackFn;
    var tanh = M.tanh || fallbackFn;
    var exp = M.exp || fallbackFn;
    var expm1 = M.expm1 || fallbackFn;
    var log1p = M.log1p || fallbackFn;
    // Operation polyfills
    var powPI = function (value) {
      return M.pow(M.PI, value);
    };
    var acoshPf = function (value) {
      return M.log(value + M.sqrt(value * value - 1));
    };
    var asinhPf = function (value) {
      return M.log(value + M.sqrt(value * value + 1));
    };
    var atanhPf = function (value) {
      return M.log((1 + value) / (1 - value)) / 2;
    };
    var sinhPf = function (value) {
      return M.exp(value) - 1 / M.exp(value) / 2;
    };
    var coshPf = function (value) {
      return (M.exp(value) + 1 / M.exp(value)) / 2;
    };
    var expm1Pf = function (value) {
      return M.exp(value) - 1;
    };
    var tanhPf = function (value) {
      return (M.exp(2 * value) - 1) / (M.exp(2 * value) + 1);
    };
    var log1pPf = function (value) {
      return M.log(1 + value);
    };
    // Note: constant values are empirical
    return {
      acos: acos(0.123124234234234242),
      acosh: acosh(1e308),
      acoshPf: acoshPf(1e154),
      asin: asin(0.123124234234234242),
      asinh: asinh(1),
      asinhPf: asinhPf(1),
      atanh: atanh(0.5),
      atanhPf: atanhPf(0.5),
      atan: atan(0.5),
      sin: sin(-1e300),
      sinh: sinh(1),
      sinhPf: sinhPf(1),
      cos: cos(10.000000000123),
      cosh: cosh(1),
      coshPf: coshPf(1),
      tan: tan(-1e300),
      tanh: tanh(1),
      tanhPf: tanhPf(1),
      exp: exp(1),
      expm1: expm1(1),
      expm1Pf: expm1Pf(1),
      log1p: log1p(10),
      log1pPf: log1pPf(10),
      powPI: powPI(-100),
    };
  }

  /**
   * We use m or w because these two characters take up the maximum width.
   * Also there are a couple of ligatures.
   */
  var defaultText = "mmMwWLliI0fiflO&1";
  /**
   * Settings of text blocks to measure. The keys are random but persistent words.
   */
  var presets = {
    /**
     * The default font. User can change it in desktop Chrome, desktop Firefox, IE 11,
     * Android Chrome (but only when the size is â‰¥ than the default) and Android Firefox.
     */
    default: [],
    /** OS font on macOS. User can change its size and weight. Applies after Safari restart. */
    apple: [{ font: "-apple-system-body" }],
    /** User can change it in desktop Chrome and desktop Firefox. */
    serif: [{ fontFamily: "serif" }],
    /** User can change it in desktop Chrome and desktop Firefox. */
    sans: [{ fontFamily: "sans-serif" }],
    /** User can change it in desktop Chrome and desktop Firefox. */
    mono: [{ fontFamily: "monospace" }],
    /**
     * Check the smallest allowed font size. User can change it in desktop Chrome, desktop Firefox and desktop Safari.
     * The height can be 0 in Chrome on a retina display.
     */
    min: [{ fontSize: "1px" }],
    /** Tells one OS from another in desktop Chrome. */
    system: [{ fontFamily: "system-ui" }],
  };
  /**
   * The result is a dictionary of the width of the text samples.
   * Heights aren't included because they give no extra entropy and are unstable.
   *
   * The result is very stable in IE 11, Edge 18 and Safari 14.
   * The result changes when the OS pixel density changes in Chromium 87. The real pixel density is required to solve,
   * but seems like it's impossible: https://stackoverflow.com/q/1713771/1118709.
   * The "min" and the "mono" (only on Windows) value may change when the page is zoomed in Firefox 87.
   */
  function getFontPreferences() {
    return withNaturalFonts(function (document, container) {
      var elements = {};
      var sizes = {};
      // First create all elements to measure. If the DOM steps below are done in a single cycle,
      // browser will alternate tree modification and layout reading, that is very slow.
      for (var _i = 0, _a = Object.keys(presets); _i < _a.length; _i++) {
        var key = _a[_i];
        var _b = presets[key],
          _c = _b[0],
          style = _c === void 0 ? {} : _c,
          _d = _b[1],
          text = _d === void 0 ? defaultText : _d;
        var element = document.createElement("span");
        element.textContent = text;
        element.style.whiteSpace = "nowrap";
        for (var _e = 0, _f = Object.keys(style); _e < _f.length; _e++) {
          var name_1 = _f[_e];
          var value = style[name_1];
          if (value !== undefined) {
            element.style[name_1] = value;
          }
        }
        elements[key] = element;
        container.appendChild(document.createElement("br"));
        container.appendChild(element);
      }
      // Then measure the created elements
      for (var _g = 0, _h = Object.keys(presets); _g < _h.length; _g++) {
        var key = _h[_g];
        sizes[key] = elements[key].getBoundingClientRect().width;
      }
      return sizes;
    });
  }
  /**
   * Creates a DOM environment that provides the most natural font available, including Android OS font.
   * Measurements of the elements are zoom-independent.
   * Don't put a content to measure inside an absolutely positioned element.
   */
  function withNaturalFonts(action, containerWidthPx) {
    if (containerWidthPx === void 0) {
      containerWidthPx = 4000;
    }
    /*
     * Requirements for Android Chrome to apply the system font size to a text inside an iframe:
     * - The iframe mustn't have a `display: none;` style;
     * - The text mustn't be positioned absolutely;
     * - The text block must be wide enough.
     *   2560px on some devices in portrait orientation for the biggest font size option (32px);
     * - There must be much enough text to form a few lines (I don't know the exact numbers);
     * - The text must have the `text-size-adjust: none` style. Otherwise the text will scale in "Desktop site" mode;
     *
     * Requirements for Android Firefox to apply the system font size to a text inside an iframe:
     * - The iframe document must have a header: `<meta name="viewport" content="width=device-width, initial-scale=1" />`.
     *   The only way to set it is to use the `srcdoc` attribute of the iframe;
     * - The iframe content must get loaded before adding extra content with JavaScript;
     *
     * https://example.com as the iframe target always inherits Android font settings so it can be used as a reference.
     *
     * Observations on how page zoom affects the measurements:
     * - macOS Safari 11.1, 12.1, 13.1, 14.0: zoom reset + offsetWidth = 100% reliable;
     * - macOS Safari 11.1, 12.1, 13.1, 14.0: zoom reset + getBoundingClientRect = 100% reliable;
     * - macOS Safari 14.0: offsetWidth = 5% fluctuation;
     * - macOS Safari 14.0: getBoundingClientRect = 5% fluctuation;
     * - iOS Safari 9, 10, 11.0, 12.0: haven't found a way to zoom a page (pinch doesn't change layout);
     * - iOS Safari 13.1, 14.0: zoom reset + offsetWidth = 100% reliable;
     * - iOS Safari 13.1, 14.0: zoom reset + getBoundingClientRect = 100% reliable;
     * - iOS Safari 14.0: offsetWidth = 100% reliable;
     * - iOS Safari 14.0: getBoundingClientRect = 100% reliable;
     * - Chrome 42, 65, 80, 87: zoom 1/devicePixelRatio + offsetWidth = 1px fluctuation;
     * - Chrome 42, 65, 80, 87: zoom 1/devicePixelRatio + getBoundingClientRect = 100% reliable;
     * - Chrome 87: offsetWidth = 1px fluctuation;
     * - Chrome 87: getBoundingClientRect = 0.7px fluctuation;
     * - Firefox 48, 51: offsetWidth = 10% fluctuation;
     * - Firefox 48, 51: getBoundingClientRect = 10% fluctuation;
     * - Firefox 52, 53, 57, 62, 66, 67, 68, 71, 75, 80, 84: offsetWidth = width 100% reliable, height 10% fluctuation;
     * - Firefox 52, 53, 57, 62, 66, 67, 68, 71, 75, 80, 84: getBoundingClientRect = width 100% reliable, height 10%
     *   fluctuation;
     * - Android Chrome 86: haven't found a way to zoom a page (pinch doesn't change layout);
     * - Android Firefox 84: font size in accessibility settings changes all the CSS sizes, but offsetWidth and
     *   getBoundingClientRect keep measuring with regular units, so the size reflects the font size setting and doesn't
     *   fluctuate;
     * - IE 11, Edge 18: zoom 1/devicePixelRatio + offsetWidth = 100% reliable;
     * - IE 11, Edge 18: zoom 1/devicePixelRatio + getBoundingClientRect = reflects the zoom level;
     * - IE 11, Edge 18: offsetWidth = 100% reliable;
     * - IE 11, Edge 18: getBoundingClientRect = 100% reliable;
     */
    return withIframe(function (_, iframeWindow) {
      var iframeDocument = iframeWindow.document;
      var iframeBody = iframeDocument.body;
      var bodyStyle = iframeBody.style;
      bodyStyle.width = containerWidthPx + "px";
      bodyStyle.webkitTextSizeAdjust = bodyStyle.textSizeAdjust = "none";
      // See the big comment above
      if (isChromium()) {
        iframeBody.style.zoom = "" + 1 / iframeWindow.devicePixelRatio;
      } else if (isWebKit()) {
        iframeBody.style.zoom = "reset";
      }
      // See the big comment above
      var linesOfText = iframeDocument.createElement("div");
      linesOfText.textContent = __spreadArrays(
        Array((containerWidthPx / 20) << 0)
      )
        .map(function () {
          return "word";
        })
        .join(" ");
      iframeBody.appendChild(linesOfText);
      return action(iframeDocument, iframeBody);
    }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
  }

  /**
   * The list of entropy sources used to make visitor identifiers.
   *
   * This value isn't restricted by Semantic Versioning, i.e. it may be changed without bumping minor or major version of
   * this package.
   */
  var sources = {
    // READ FIRST:
    // See https://github.com/fingerprintjs/fingerprintjs/blob/master/contributing.md#how-to-make-an-entropy-source
    // to learn how entropy source works and how to make your own.
    // The sources run in this exact order.
    // The asynchronous sources are at the start to run in parallel with other sources.
    fonts: getFonts,
    domBlockers: getDomBlockers,
    fontPreferences: getFontPreferences,
    audio: getAudioFingerprint,
    screenFrame: getRoundedScreenFrame,
    osCpu: getOsCpu,
    languages: getLanguages,
    colorDepth: getColorDepth,
    deviceMemory: getDeviceMemory,
    screenResolution: getScreenResolution,
    hardwareConcurrency: getHardwareConcurrency,
    timezone: getTimezone,
    sessionStorage: getSessionStorage,
    localStorage: getLocalStorage,
    indexedDB: getIndexedDB,
    openDatabase: getOpenDatabase,
    cpuClass: getCpuClass,
    platform: getPlatform,
    plugins: getPlugins,
    canvas: getCanvasFingerprint,
    touchSupport: getTouchSupport,
    vendor: getVendor,
    vendorFlavors: getVendorFlavors,
    cookiesEnabled: areCookiesEnabled,
    colorGamut: getColorGamut,
    invertedColors: areColorsInverted,
    forcedColors: areColorsForced,
    monochrome: getMonochromeDepth,
    contrast: getContrastPreference,
    reducedMotion: isMotionReduced,
    hdr: isHDR,
    math: getMathFingerprint,
  };
  /**
   * Loads the built-in entropy sources.
   * Returns a function that collects the entropy components to make the visitor identifier.
   */
  function loadBuiltinSources(options) {
    return loadSources(sources, options, []);
  }

  var commentTemplate = "$ if upgrade to Pro: https://fpjs.dev/pro";
  function getConfidence(components) {
    var openConfidenceScore = getOpenConfidenceScore(components);
    var proConfidenceScore = deriveProConfidenceScore(openConfidenceScore);
    return {
      score: openConfidenceScore,
      comment: commentTemplate.replace(/\$/g, "" + proConfidenceScore),
    };
  }
  function getOpenConfidenceScore(components) {
    // In order to calculate the true probability of the visitor identifier being correct, we need to know the number of
    // website visitors (the higher the number, the less the probability because the fingerprint entropy is limited).
    // JS agent doesn't know the number of visitors, so we can only do an approximate assessment.
    if (isAndroid()) {
      return 0.4;
    }
    // Safari (mobile and desktop)
    if (isWebKit()) {
      return isDesktopSafari() ? 0.5 : 0.3;
    }
    var platform = components.platform.value || "";
    // Windows
    if (/^Win/.test(platform)) {
      // The score is greater than on macOS because of the higher variety of devices running Windows.
      // Chrome provides more entropy than Firefox according too
      // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Windows%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22id%22%3A%22browsersDesktop%22%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
      // So we assign the same score to them.
      return 0.6;
    }
    // macOS
    if (/^Mac/.test(platform)) {
      // Chrome provides more entropy than Safari and Safari provides more entropy than Firefox.
      // Chrome is more popular than Safari and Safari is more popular than Firefox according to
      // https://netmarketshare.com/browser-market-share.aspx?options=%7B%22filter%22%3A%7B%22%24and%22%3A%5B%7B%22platform%22%3A%7B%22%24in%22%3A%5B%22Mac%20OS%22%5D%7D%7D%5D%7D%2C%22dateLabel%22%3A%22Trend%22%2C%22attributes%22%3A%22share%22%2C%22group%22%3A%22browser%22%2C%22sort%22%3A%7B%22share%22%3A-1%7D%2C%22id%22%3A%22browsersDesktop%22%2C%22dateInterval%22%3A%22Monthly%22%2C%22dateStart%22%3A%222019-11%22%2C%22dateEnd%22%3A%222020-10%22%2C%22segments%22%3A%22-1000%22%7D
      // So we assign the same score to them.
      return 0.5;
    }
    // Another platform, e.g. a desktop Linux. It's rare, so it should be pretty unique.
    return 0.7;
  }
  function deriveProConfidenceScore(openConfidenceScore) {
    return round(0.99 + 0.01 * openConfidenceScore, 0.0001);
  }

  function componentsToCanonicalString(components) {
    var result = "";
    for (
      var _i = 0, _a = Object.keys(components).sort();
      _i < _a.length;
      _i++
    ) {
      var componentKey = _a[_i];
      var component = components[componentKey];
      var value = component.error ? "error" : JSON.stringify(component.value);
      result +=
        "" +
        (result ? "|" : "") +
        componentKey.replace(/([:|\\])/g, "\\$1") +
        ":" +
        value;
    }
    return result;
  }
  function componentsToDebugString(components) {
    return JSON.stringify(
      components,
      function (_key, value) {
        if (value instanceof Error) {
          return errorToObject(value);
        }
        return value;
      },
      2
    );
  }
  function hashComponents(components) {
    return x64hash128(componentsToCanonicalString(components));
  }
  /**
   * Makes a GetResult implementation that calculates the visitor id hash on demand.
   * Designed for optimisation.
   */
  function makeLazyGetResult(components) {
    var visitorIdCache;
    // This function runs very fast, so there is no need to make it lazy
    var confidence = getConfidence(components);
    // A plain class isn't used because its getters and setters aren't enumerable.
    return {
      get visitorId() {
        if (visitorIdCache === undefined) {
          visitorIdCache = hashComponents(this.components);
        }
        return visitorIdCache;
      },
      set visitorId(visitorId) {
        visitorIdCache = visitorId;
      },
      confidence: confidence,
      components: components,
      version: version,
    };
  }
  /**
   * A delay is required to ensure consistent entropy components.
   * See https://github.com/fingerprintjs/fingerprintjs/issues/254
   * and https://github.com/fingerprintjs/fingerprintjs/issues/307
   * and https://github.com/fingerprintjs/fingerprintjs/commit/945633e7c5f67ae38eb0fea37349712f0e669b18
   */
  function prepareForSources(delayFallback) {
    if (delayFallback === void 0) {
      delayFallback = 50;
    }
    // A proper deadline is unknown. Let it be twice the fallback timeout so that both cases have the same average time.
    return requestIdleCallbackIfAvailable(delayFallback, delayFallback * 2);
  }
  /**
   * The function isn't exported from the index file to not allow to call it without `load()`.
   * The hiding gives more freedom for future non-breaking updates.
   *
   * A factory function is used instead of a class to shorten the attribute names in the minified code.
   * Native private class fields could've been used, but TypeScript doesn't allow them with `"target": "es5"`.
   */
  function makeAgent(getComponents, debug) {
    var creationTime = Date.now();
    return {
      get: function (options) {
        return __awaiter(this, void 0, void 0, function () {
          var startTime, components, result;
          return __generator(this, function (_a) {
            switch (_a.label) {
              case 0:
                startTime = Date.now();
                return [4 /*yield*/, getComponents()];
              case 1:
                components = _a.sent();
                result = makeLazyGetResult(components);
                if (
                  debug ||
                  (options === null || options === void 0
                    ? void 0
                    : options.debug)
                ) {
                  // console.log is ok here because it's under a debug clause
                  // eslint-disable-next-line no-console
                  console.log(
                    "Copy the text below to get the debug data:\n\n```\nversion: " +
                      result.version +
                      "\nuserAgent: " +
                      navigator.userAgent +
                      "\ntimeBetweenLoadAndGet: " +
                      (startTime - creationTime) +
                      "\nvisitorId: " +
                      result.visitorId +
                      "\ncomponents: " +
                      componentsToDebugString(components) +
                      "\n```"
                  );
                }
                return [2 /*return*/, result];
            }
          });
        });
      },
    };
  }
  /**
   * Sends an unpersonalized AJAX request to collect installation statistics
   */
  function monitor() {
    // The FingerprintJS CDN (https://github.com/fingerprintjs/cdn) replaces `window.__fpjs_d_m` with `true`
    if (window.__fpjs_d_m || Math.random() >= 0.01) {
      return;
    }
    try {
      var request = new XMLHttpRequest();
      request.open(
        "get",
        "https://openfpcdn.io/fingerprintjs/v" + version + "/npm-monitoring",
        true
      );
      request.send();
    } catch (error) {
      // console.error is ok here because it's an unexpected error handler
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
  /**
   * Builds an instance of Agent and waits a delay required for a proper operation.
   */
  function load(_a) {
    var _b = _a === void 0 ? {} : _a,
      delayFallback = _b.delayFallback,
      debug = _b.debug,
      _c = _b.monitoring,
      monitoring = _c === void 0 ? true : _c;
    return __awaiter(this, void 0, void 0, function () {
      var getComponents;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            if (monitoring) {
              monitor();
            }
            return [4 /*yield*/, prepareForSources(delayFallback)];
          case 1:
            _d.sent();
            getComponents = loadBuiltinSources({ debug: debug });
            return [2 /*return*/, makeAgent(getComponents, debug)];
        }
      });
    });
  }

  // The default export is a syntax sugar (`import * as FP from '...' â†’ import FP from '...'`).
  // It should contain all the public exported values.
  var index = {
    load: load,
    hashComponents: hashComponents,
    componentsToDebugString: componentsToDebugString,
  };

  async function loadFingerPrintData() {
    let fingerPrintLoaded = await index.load();
    return await fingerPrintLoaded.get();
  }

  function getTimeDifference() {
    const today = new Date();
    return today.getTimezoneOffset();
  }

  function getUserAgent() {
    return navigator.userAgent;
  }

  async function getDeviceData() {
    return loadFingerPrintData()
      .then((deviceFingerPrintData) =>
        retrieveDeviceInformation(deviceFingerPrintData)
      )
      .catch(() => null);
  }

  function retrieveDeviceInformation(deviceInfo) {
    const componentInfo = deviceInfo.components;
    return {
      httpBrowserColorDepth: numberTypeOrNull(componentInfo.colorDepth.value),
      httpBrowserJavaEnabled: validateBoolean(false),
      httpBrowserJavaScriptEnabled: true,
      httpBrowserLanguage: arrayValueOrDefault(
        componentInfo.languages.value[0][0],
        "pt-BR"
      ),
      httpBrowserScreenHeight: numberTypeOrNull(
        componentInfo.screenResolution.value[1]
      ),
      httpBrowserScreenWidth: numberTypeOrNull(
        componentInfo.screenResolution.value[0]
      ),
      httpBrowserTimeDifference: getTimeDifference(),
      httpDeviceChannel: "Browser",
      userAgentBrowserValue: getUserAgent(),
    };
  }

  function arrayValueOrDefault(value, defaultValue) {
    if (value === undefined) {
      return defaultValue;
    }
    return value;
  }

  function numberTypeOrNull(value) {
    if (!isNaN(parseFloat(value)) && isFinite(value)) {
      return value;
    }
    return null;
  }

  function validateBoolean(value) {
    if (typeof value == "boolean" || value === "true" || value === "false") {
      return value;
    }
    return null;
  }

  async function authenticate3DS(authenticationRequest) {
    let request = await completeRequest(authenticationRequest.data);

    let authentication = await initializeAuthentication(request);

    if (authentication.status != "REQUIRE_INITIALIZATION") {
      return authentication;
    }

    await setUp(authentication.initialization);

    authentication = await confirmAuthentication(authentication.id);

    if (authentication.status != "REQUIRE_CHALLENGE") {
      return authentication;
    }

    let challengeResultJwt = await executeChallenge(
      authentication.challenge,
      authenticationRequest.beforeChallenge
    );

    authentication = await verifyAuthentication(
      authentication.id,
      challengeResultJwt
    );

    return authentication;
  }

  async function completeRequest(request) {
    const encryptPCIDataPromise = await encryptPCIData(request);
    const loadDeviceInfoPromise = await loadDeviceInfo(request);

    return Promise.all([encryptPCIDataPromise, loadDeviceInfoPromise]).then(
      () => {
        return request;
      }
    );
  }

  async function loadDeviceInfo(request) {
    try {
      request.deviceInformation = await getDeviceData();
    } catch {
      request.deviceInformation = null;
    }
  }

  async function encryptPCIData(request) {
    if (hasCard(request) && request.paymentMethod.card.number) {
      let card = request.paymentMethod.card;
      let pkResponse = await getPublicKey();

      const result = encryptCard({
        publicKey: pkResponse.publicKey,
        holder: card.holder ? card.holder.name : "",
        number: card.number,
        expMonth: card.expMonth,
        expYear: card.expYear,
      });

      if (result.hasErrors) {
        throw new PagSeguroError("Invalid parameter", {
          httpStatus: 400,
          traceId: "clientSdkError",
          message: "Invalid Parameters",
          errorMessages: convertErrorMessages(result.errors),
        });
      }

      request.paymentMethod.card = { encrypted: result.encryptedCard };
    }
  }

  function hasCard(request) {
    return request.paymentMethod && request.paymentMethod.card;
  }

  function convertErrorMessages(errors) {
    return errors.map(function (error) {
      return {
        code: "40002", // TODO Verificar se o code deve ser String ou integer
        description: error.message,
        parameterName: resolveErrorCode(error.code),
      };
    });
  }

  function resolveErrorCode(errorCode) {
    switch (errorCode) {
      case "INVALID_NUMBER":
        return "paymentMethod.card.number";
      case "INVALID_EXPIRATION_MONTH":
        return "paymentMethod.card.expMonth";
      case "INVALID_EXPIRATION_YEAR":
        return "paymentMethod.card.expYear";
      case "INVALID_HOLDER":
        return "paymentMethod.card.holder.name";
      default:
        return "paymentMethod.card";
    }
  }

  var setUp$1 = (parameters) => {
    if (parameters) {
      if (parameters.env) {
        validateEnv(parameters.env);
      }

      PSConfigurations.setUp(parameters);
    }
  };

  function validateEnv(env) {
    switch (env) {
      case "LOCAL":
      case "QA":
      case "SANDBOX-QA":
      case "SANDBOX":
      case "PROD":
        break;
      default:
        throw new PagSeguroError("Invalid environment", {
          httpStatus: "400",
          traceId: "clientSdkError",
          message: "Invalid Parameters",
          errorMessages: [
            {
              code: "40002",
              description: "allowed values are: [PROD, SANDBOX]",
              parameterName: "env",
            },
          ],
        });
    }
  }

  const env = {
    PROD: "PROD",
    SANDBOX: "SANDBOX",
  };

  exports.PagSeguroError = PagSeguroError;
  exports.authenticate3DS = authenticate3DS;
  exports.encryptCard = encryptCard;
  exports.env = env;
  exports.setUp = setUp$1;

  return exports;
})({});

export {PagSeguro}