import { Component } from "react";
import { FaAnglesLeft } from "react-icons/fa6";
import { FaAnglesRight } from "react-icons/fa6";

class Pagination extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="flex flex-row justify-between items-center mt-5">
        <div>
          <span>Records Per Page :</span>
          <select
            name="recPerPage"
            value={this.props.recPerPage}
            onChange={(e) => this.props.handleRecPerPage(e)}
          >
            <option value={this.props.dataLength}>All</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>

        <div className="flex flex-row gap-3">
            <button onClick={this.props.prevPage}>
              <FaAnglesLeft/>
            </button>
            <span>Page : {this.props.pageNo} out of {this.props.totalPages}</span>
            <button onClick={this.props.nextPage}>
              <FaAnglesRight/>
            </button>
        </div>
      </div>
    );
  }
}

export default Pagination;
