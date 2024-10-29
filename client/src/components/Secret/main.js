import React, { useEffect, useRef } from "react";
import {
  Layout,
  Menu,
  Card,
  Button,
  Typography,
  Row,
  Col,
  Carousel,
} from "antd";
import { HeartFilled, TeamOutlined, TrophyOutlined } from "@ant-design/icons";
import * as THREE from "three";
import { motion } from "framer-motion";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

export default function Component() {
  const threeJsRef = useRef(null);

  useEffect(() => {
    // Three.js setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    threeJsRef.current.appendChild(renderer.domElement);

    // Create a rotating cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      renderer.dispose();
    };
  }, []);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      }}
    >
      <Header
        style={{
          background: "rgba(220, 38, 38, 0.9)",
          padding: "0 20px",
          position: "fixed",
          width: "100%",
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src="/placeholder.svg?height=40&width=40"
            alt="Logo"
            style={{
              marginRight: "16px",
              filter: "drop-shadow(0 0 2px rgba(255,255,255,0.7))",
            }}
          />
          <Title
            level={3}
            style={{
              color: "white",
              margin: 0,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            District Special Olympics Association Jalandhar
          </Title>
        </motion.div>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ background: "transparent" }}
        >
          <Menu.Item key="1" style={{ color: "white", fontSize: "16px" }}>
            About
          </Menu.Item>
          <Menu.Item key="2" style={{ color: "white", fontSize: "16px" }}>
            Mission
          </Menu.Item>
          <Menu.Item key="3" style={{ color: "white", fontSize: "16px" }}>
            Join Us
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ paddingTop: "64px" }}>
        <div ref={threeJsRef} style={{ position: "fixed", zIndex: -1 }} />
        
        <Carousel autoplay style={{ height: "600px" }}>
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{
                height: "600px",
                background:
                  "url(https://source.unsplash.com/random/1600x900?sports) center/cover no-repeat",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "25px",
                  background: "rgba(0,0,0,0.6)",
                  borderRadius: "15px",
                  maxWidth: "800px",
                }}
              >
                <motion.h1
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  style={{
                    color: "white",
                    fontSize: "48px",
                    marginBottom: "24px",
                    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  Empowering Athletes, Transforming Lives
                </motion.h1>
                <motion.p
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  style={{
                    fontSize: "24px",
                    marginBottom: "32px",
                    color: "white",
                  }}
                >
                  Join us in celebrating determination, resilience, and the
                  indomitable spirit of our athletes.
                </motion.p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      backgroundColor: "#dc2626",
                      borderColor: "#dc2626",
                      fontSize: "20px",
                      height: "50px",
                      padding: "0 30px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                    }}
                  >
                    Get Involved
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </Carousel>

        <div
          style={{ maxWidth: "1280px", margin: "80px auto", padding: "0 20px" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Title
              level={2}
              style={{
                textAlign: "center",
                marginBottom: "60px",
                fontSize: "36px",
                color: "#333",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              About District Special Olympics Association Jalandhar
            </Title>
            <Card
              style={{
                marginBottom: "80px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              <Paragraph
                style={{ fontSize: "18px", lineHeight: "1.8", color: "#444" }}
              >
                District Special Olympics Association Jalandhar(DSOA) is a national sports organization
                dedicated to empowering individuals with intellectual disabilities
                through the transformative power of sports. As part of the global
                Special Olympics movement, we provide year-round training and
                athletic competitions across a variety of Olympic-style sports,
                giving our athletes the opportunity to develop physical fitness,
                demonstrate courage, and experience joy.
              </Paragraph>
              <Paragraph
                style={{ fontSize: "18px", lineHeight: "1.8", color: "#444" }}
              >
                At District Special Olympics Association Jalandhar, we believe in the potential of every
                individual, regardless of ability. We create a platform where
                athletes can excel, gain self-confidence, and integrate into their
                communities. Our programs foster a sense of belonging, helping
                athletes not only improve their health and fitness but also
                enhance their social skills and personal growth.
              </Paragraph>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Title
              level={2}
              style={{
                textAlign: "center",
                marginBottom: "60px",
                fontSize: "36px",
                color: "#333",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Our Mission
            </Title>
            <Row gutter={[32, 32]} style={{ marginBottom: "80px" }}>
              <Col xs={24} md={8}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card
                    style={{
                      height: "100%",
                      textAlign: "center",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      borderRadius: "15px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                    hoverable
                    cover={
                      <HeartFilled
                        style={{
                          fontSize: "80px",
                          color: "#dc2626",
                          margin: "40px 0",
                        }}
                      />
                    }
                  >
                    <Card.Meta
                      title={
                        <span style={{ fontSize: "24px", color: "#333" }}>
                          Empower
                        </span>
                      }
                      description={
                        <span style={{ fontSize: "16px", color: "#666" }}>
                          Empowering individuals with intellectual disabilities
                          through sports
                        </span>
                      }
                    />
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} md={8}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card
                    style={{
                      height: "100%",
                      textAlign: "center",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      borderRadius: "15px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                    hoverable
                    cover={
                      <TeamOutlined
                        style={{
                          fontSize: "80px",
                          color: "#dc2626",
                          margin: "40px 0",
                        }}
                      />
                    }
                  >
                    <Card.Meta
                      title={
                        <span style={{ fontSize: "24px", color: "#333" }}>
                          Include
                        </span>
                      }
                      description={
                        <span style={{ fontSize: "16px", color: "#666" }}>
                          Fostering inclusion and acceptance in communities across
                          India
                        </span>
                      }
                    />
                  </Card>
                </motion.div>
              </Col>
              <Col xs={24} md={8}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Card
                    style={{
                      height: "100%",
                      textAlign: "center",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                      borderRadius: "15px",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                    }}
                    hoverable
                    cover={
                      <TrophyOutlined
                        style={{
                          fontSize: "80px",
                          color: "#dc2626",
                          margin: "40px 0",
                        }}
                      />
                    }
                  >
                    <Card.Meta
                      title={
                        <span style={{ fontSize: "24px", color: "#333" }}>
                          Celebrate
                        </span>
                      }
                      description={
                        <span style={{ fontSize: "16px", color: "#666" }}>
                          Celebrating the achievements and potential of every
                          athlete
                        </span>
                      }
                    />
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card
              style={{
                textAlign: "center",
                background: "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
                color: "white",
                boxShadow: "0 10px 30px rgba(220,38,38,0.3)",
                borderRadius: "15px",
                overflow: "hidden",
                padding: "60px 40px",
              }}
            >
              <Title
                level={2}
                style={{
                  color: "white",
                  marginBottom: "30px",
                  fontSize: "36px",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Join Our Movement
              </Title>
              <Paragraph
                style={{
                  fontSize: "20px",
                  marginBottom: "40px",
                  maxWidth: "800px",
                  margin: "0 auto 40px",
                }}
              >
                Together, we are transforming lives—one athlete, one sport, and
                one victory at a time. Be part of something extraordinary!
              </Paragraph>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="large"
                  style={{
                    backgroundColor: "white",
                    color: "#dc2626",
                    borderColor: "white",
                    fontSize: "20px",
                    height: "50px",
                    padding: "0 30px",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Become a Volunteer
                </Button>
              </motion.div>
            </Card>
          </motion.div>
        </div>
      </Content>

      <Footer
        style={{
          backgroundColor: "#1f2937",
          color: "white",
          textAlign: "center",
          padding: "40px 20px",
        }}
      >
        <Paragraph
          style={{ fontSize: "16px", marginBottom: "20px", color: "white" }}
        >
          &copy; 2023 District Special Olympics Association Jalandhar. All rights reserved.
        </Paragraph>
        <div>
          <Button
            type="link"
            style={{ color: "#dc2626", fontSize: "16px", margin: "0 10px" }}
          >
            Facebook
          </Button>
          <Button
            type="link"
            style={{ color: "#dc2626", fontSize: "16px", margin: "0 10px" }}
          >
            Twitter
          </Button>
          <Button
            type="link"
            style={{ color: "#dc2626", fontSize: "16px", margin: "0 10px" }}
          >
            Instagram
          </Button>
        </div>
      </Footer>
    </Layout>
  );
}