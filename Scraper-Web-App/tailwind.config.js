// The following MIT License notice applies to the usage of Tailwindcss throughout this project.


// MIT License

// Copyright (c) Adam Wathan <adam.wathan@gmail.com>
// Copyright (c) Jonathan Reinink <jonathan@reinink.ca>

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.



const colors = require('tailwindcss/colors');
module.exports = {
    prefix: '',
    purge: {
      content: [
        './src/**/*.{html,ts}',
      ]
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
      extend: {
        width: {
          '1/10': '10%',
          '1/8': '12.5%',
          '3/8': '37.5%'
        },
        minWidth: {
          '1/10': '10%',
          '1/5': '20%'
        }
      },
      textColor: {
        'primary': '#B0B2B5' 
      },
      colors: {
        secondary: '#9CB6C2',
        primary: '#D8E7ED',
        accentSecondary: '#FF8B59',
        accentPrimary: '#FFB857',
        background: colors.coolGray[100],
        transparent: 'transparent',
        current: 'currentColor',
        blueGray: colors.blueGray,
        coolGray: colors.coolGray,
        green: colors.green,
        emerald: colors.emerald,
        teal: colors.teal,
        cyan: colors.cyan,
        lightBlue: colors.lightBlue,
        blue: colors.blue,
        indigo: colors.indigo,
        violet: colors.violet,
        purple: colors.purple,
        rose: colors.rose,
        orange: colors.orange,
        amber: colors.amber,
        yellow: colors.amber,
        lime: colors.lime,
        white: colors.white
      }
    },
    variants: {
      extend: {},
    },
    plugins: [require('@tailwindcss/forms'),require('@tailwindcss/typography')],
};