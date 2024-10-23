import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CKEditor from '../../Components/CKEditor';
import "notyf/notyf.min.css";
import { Notyf } from "notyf";
import axios from 'axios';
import { Dropzone, FileMosaic } from "@dropzone-ui/react";

function Index() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [timelineItems, setTimelineItems] = useState([]);
  const [title,setTitle]= useState('');
  const updateFiles = (incommingFiles) => {
    setImages(incommingFiles);
  };
  useEffect(() => {
    axios.get('/api/blogs').then((res) => {
      setTimelineItems(res.data);
      console.log(res.data);

    })
  }, [])
  const notyf = new Notyf({
    duration: 1000,
    position: { x: "right", y: "top" },
    types: [
      { type: "error", background: "indianred", duration: 2000, dismissible: true },
      { type: "success", background: "green", color: "white", duration: 2000, dismissible: true },
    ],
  });

  // Fetch the blog data from the API
  useEffect(() => {
    axios.get("/api/blogs").then((res) => {
      setTimelineItems( res.data);
    });
  }, []);

  const submitBlog = () => {
    if (date === '' || content === ''||title=='') {
      notyf.error("Thiếu ngày và nội dung");
    } else if (images.length === 0) {
      notyf.error("Thiếu hình ảnh");
    } else {
      var formData = new FormData();
      formData.append("date", date);
      formData.append("title", title);
      formData.append('content', content);
      images.forEach(el => {
        formData.append('images[]', el.file);
      });
      axios.post("/api/blogs", formData, { headers: { Accept: "application/json" } })
        .then((res) => {
          if (res.data.check === true) {
            notyf.success("Blog added successfully!");
            setTimelineItems(res.data.data)
            setShow(false);
          }
        });
    }
  };

  return (
    <>
      <Modal show={show} size='xl' onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Ghi blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input type="date" className='form-control mb-3' onChange={(e) => setDate(e.target.value)} />
          <input type="text" className='form-control mb-3' onChange={(e) => setTitle(e.target.value)} />
          <div className="row">
            <div className="col-md">
              <CKEditor onBlur={setContent} />
            </div>
            <div className="col-md-3">
              <Dropzone onChange={updateFiles} value={images}>
                {images.map((image) => (
                  <FileMosaic {...image} preview />
                ))}
              </Dropzone>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={submitBlog}>Thêm</Button>
        </Modal.Footer>
      </Modal>

      <div className="container mt-2">
        {/* <div className="row">
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            style={{ height: 400, width: 'auto' }}
          >
            <SwiperSlide>
              <div className="slider-image-container d-flex justify-content-center align-items-center">
                <img
                  src="https://literaturevaults.com/wp-content/uploads/2024/02/Two-lovers-sharing-a-quiet-moment-in-a-spring-garden-1024x768.jpg"
                  className="slider-image"
                  alt="Slide 1"
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="slider-image-container d-flex justify-content-center align-items-center">
                <img
                  src="https://cdn.pixabay.com/photo/2024/10/18/10/00/ai-generated-9129961_640.jpg"
                  className="slider-image"
                  alt="Slide 2"
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="slider-image-container d-flex justify-content-center align-items-center">
                <img
                  src="https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg"
                  className="slider-image"
                  alt="Slide 3"
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div> */}

        <div className="row mt-3 text-center">
          <div className="col-md text-center">
            <button className='btn btn-outline-primary' onClick={handleShow}>Thêm khoảnh khắc</button>
          </div>
        </div>

        {/* Chrono timeline component */}
        <div className="row mt-3 text-center mb-5 d-flex justify-content-center">
          <div className="col-md-9">
            <VerticalTimeline>
              {timelineItems.length > 0 && timelineItems.map((item,index) => (
                <VerticalTimelineElement
                className="vertical-timeline-element--work"
                contentStyle={{
                  background: index %2== 0 ? 'rgb(33, 150, 243)' : 'black',
                  color: index %2== 0 ? '#fff' : 'white',
                }}
                contentArrowStyle={{
                  borderRight: index === 0 ? '7px solid rgb(33, 150, 243)' : '7px solid white',
                }}
                date={item.date}
                iconStyle={{ background: index === 0 ? 'rgb(33, 150, 243)' : 'black', color: '#fff' }}
              >
                <h3 className="vertical-timeline-element-title mb-2">
                  {item.title}
                </h3>
                <div className='text-start'
      dangerouslySetInnerHTML={{__html: item.content}}
    />
              
              {item.images.length>0?
              <>
              <Swiper
            spaceBetween={50}
            slidesPerView={1}
            style={{ height: 400, width: 'auto' }}
          >

           {item.images.map((image,index)=>(
             <SwiperSlide>
             <div className="slider-image-container d-flex justify-content-center align-items-center">
               <img
                 src={image.image}
                 className="slider-image"
                 alt="Slide 1"
               />
             </div>
           </SwiperSlide>
           ))}
          </Swiper>
              </>:''}
              </VerticalTimelineElement>
              ))}
            </VerticalTimeline>
          </div>
        </div>
      </div>

      {/* Custom styles */}
      <style jsx>{`
        .slider-image-container {
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .slider-image {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        }
      `}</style>
    </>
  );
}

export default Index;
