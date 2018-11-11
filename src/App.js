import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
const XLSX = window['XLSX']
class App extends Component {
  state = {}

  render() {
    return (
      <div className="App">
        <div>
          <textarea
            value={this.state.content}
            onChange={(e) => this.setState({ content: e.target.value })}
          />
        </div>
        <button onClick={this.click}>X</button>
      </div>
    );
  }

  click = () => {
    const json = this.parserJson()
    console.log(json);

    var ws = XLSX.utils.json_to_sheet(json, { header: ["Họ tên", "Ngày sinh", "Địa chỉ", "Điện thoại", "Email", "Nội dung"] });

    var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'xxx');

    window['XLSX'].writeFile(wb, 'test.xlsx');
  };

  groupTexts = () => {
    const { content } = this.state;
    const stringAreas = []
    let lastStringArea = []

    var lines = content.split('\n');
    for (var i = 0; i < lines.length; i++) {
      if (lines[i]) {
        lastStringArea[lastStringArea.length] = lines[i]
      } else {
        if (lastStringArea.length) {
          stringAreas.push([...lastStringArea])
          lastStringArea = []
        }
      }
    }
    return stringAreas
  }

  parserJson = () => {
    const groupTexts = this.groupTexts()
    const jsons = []

    for (const groupText of groupTexts) {
      const json = {}
      for (let index = 0; index < groupText.length; index++) {
        const text = groupText[index];
        const key = text.split(':')[0]
        const value = text.split(':')[1]

        let keyParsered = key.replace('-', '').trim()
        if (keyParsered === 'Tiêu đề') {
          keyParsered = "Nội dung"
        }
        
        json[keyParsered] = value
      }
      jsons.push(json)
    }
    return jsons;
  }
}

export default App;
