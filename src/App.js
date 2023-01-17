import React, { Component } from "react";
import Header from "./Header";
import NotesList from "./NotesList";

class App extends Component {
  state = {
    notes: [
      {
        id: Date.now(),
        title: "",
        description: "",
        doesMatchSearch: true
      }
    ],
    searchText: ""
  };

  addNote = () => {
    // create new note
    const newNote = {
      id: Date.now(),
      title: "",
      description: "",
      doesMatchSearch: true
    };

    // add the new note to existing notes array in State
    // this.setState({ notes: [newNote, ...this.state.notes] });

    // TWO STEP METHOD (adding new note and modify state)

    const newNotes = [newNote, ...this.state.notes];
    this.setState({ notes: newNotes });
  };

  onType = (editMeId, updatedKey, updatedValue) => {
    // editMeId == id of the note that was edited
    // updatedKey == title or description field
    // updatedValue == value of title or description
    // Begin by mapping over the notes
    const updatedNotes = this.state.notes.map((note) => {
      if (note.id !== editMeId) {
        return note;
      } else {
        if (updatedKey === "title") {
          note.title = updatedValue;
          return note;
        } else {
          note.description = updatedValue;
          return note;
        }
      }
    });

    this.setState({ notes: updatedNotes });
  };

  onSearch = (text) => {
    // to make sure all entries are the same case enter the following:
    const newSearchText = text.toLowerCase();

    const updatedNotes = this.state.notes.map((note) => {
      if (!newSearchText) {
        note.doesMatchSearch = true;
        return note;
      } else {
        const title = note.title.toLowerCase();
        const description = note.description.toLowerCase();
        // to find out if the users title/description match one of the notes use includes() element
        const titleMatch = title.includes(newSearchText);
        const descriptionMatch = description.includes(newSearchText);
        // || is an OR operator
        const hasMatch = titleMatch || descriptionMatch;
        note.doesMatchSearch = hasMatch;
        return note;
        // The method below is a little ong but has the same effect as hasMatch method
        // if (titleMatch) {
        //   note.doesMatchSearch = true
        // } else if (descriptionMatch) {
        //   note.doesMatchSearch = true
        // } else {
        //   note.doesMatchSearch = false
        // }
        // return note;
      }
    });
    this.setState({
      notes: updatedNotes,
      searchText: newSearchText
    });
  };

  removeNote = (noteId) => {
    const updatedNotes = this.state.notes.filter((note) => note.id !== noteId);
    this.setState({ notes: updatedNotes });
  };

  componentDidUpdate() {
    const stringifiedNotes = JSON.stringify(this.state.notes);
    localStorage.setItem("savedNotes", stringifiedNotes);
  }

  componentDidMount() {
    const stringifiedNotes = localStorage.getItem("savedNotes");
    if (stringifiedNotes) {
      const savedNotes = JSON.parse(stringifiedNotes);
      this.setState({ notes: savedNotes });
    }
  }

  render() {
    return (
      <div>
        {/* for HEADER &NOTELIST to be aware of addNote & onType it must be passed down */}
        <Header
          onSearch={this.onSearch}
          searchText={this.state.searchText}
          addNote={this.addNote}
        />
        <NotesList
          removeNote={this.removeNote}
          notes={this.state.notes}
          onType={this.onType}
        />
      </div>
    );
  }
}

export default App;
