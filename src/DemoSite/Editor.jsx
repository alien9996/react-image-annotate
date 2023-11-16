import React, { useState } from "react"
import Button from "@mui/material/Button"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import Select from "react-select"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import styles from "./styles"

const theme = createTheme()

const loadSavedInput = () => {
  try {
    return JSON.parse(window.localStorage.getItem("customInput") || "{}")
  } catch (e) {
    return {}
  }
}

export const examples = {
  "Simple Bounding Box": () => ({
    taskDescription:
      "Annotate each image according to this _markdown_ specification.",
    // regionTagList: [],
    // regionClsList: ["hotdog"],
    regionTagList: ["has-bun"],
    regionClsList: ["hotdog", "not-hotdog"],
    preselectCls: "not-hotdog",
    enabledTools: ["select", "create-box"],
    // showTags: true,
    images: [
      {
        src: "https://images.unsplash.com/photo-1496905583330-eb54c7e5915a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80",
        name: "hot-dogs-1",
      },
      {
        src: "https://www.bianchi.com/wp-content/uploads/2019/07/YPB17I555K.jpg",
        name: "bianchi-oltre-xr4",
      },
    ],
    allowComments: true,
  }),
  "Simple Segmentation": () => ({
    taskDescription:
      "Annotate each image according to this _markdown_ specification.",
    regionClsList: ["car", "truck"],
    enabledTools: ["select", "create-polygon"],
    images: [
      {
        src: "https://images.unsplash.com/photo-1561518776-e76a5e48f731?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80",
        name: "car-image-1",
      },
    ],
  }),
  Custom: () => loadSavedInput(),
}

const Editor = ({ onOpenAnnotator, lastOutput }) => {
  const [currentError, changeCurrentError] = useState()
  const [selectedExample, changeSelectedExample] = useState(
    window.localStorage.getItem("customInput")
      ? "Custom"
      : "Simple Bounding Box"
  )
  const [outputDialogOpen, changeOutputOpen] = useState(false)
  const [currentJSONValue, changeCurrentJSONValue] = useState(
    JSON.stringify(examples[selectedExample](), null, "  ")
  )
  return (
    <ThemeProvider theme={theme}>
      <div>
        <div style={styles.editBar}>
          <h3>React Image Annotate</h3>
          <div style={{ flexGrow: 1 }} />
          <div>
            <div style={{ display: "inline-flex" }}>
              <Select
                styles={{
                  container: (baseStyles) => ({
                    ...baseStyles,
                    ...styles.select
                  })
                }}
                value={{ label: selectedExample, value: selectedExample }}
                options={Object.keys(examples).map((s) => ({
                  label: s,
                  value: s,
                }))}
                onChange={(selectedOption) => {
                  changeSelectedExample(selectedOption.value)

                  changeCurrentJSONValue(
                    JSON.stringify(
                      selectedOption.value === "Custom"
                        ? loadSavedInput()
                        : examples[selectedOption.value](),
                      null,
                      "  "
                    )
                  )
                }}
              />
            </div>
            <Button
              className="button"
              disabled={!lastOutput}
              onClick={() => changeOutputOpen(true)}
            >
              View Output
            </Button>
            <Button
              className="button"
              variant="outlined"
              disabled={Boolean(currentError)}
              onClick={() => {
                onOpenAnnotator(
                  selectedExample === "Custom"
                    ? loadSavedInput()
                    : examples[selectedExample]
                )
              }}
            >
              Open Annotator
            </Button>
          </div>
        </div>
        <div
          style={
            {...styles.contentArea, ...currentError
              ? { border: "2px solid #f00" }
              : { border: "2px solid #fff" }}
          }
        >
          <div>
          </div>
        </div>
        <div style={styles.specificationArea}>
          <h2>React Image Annotate Format</h2>
        </div>
        <Dialog fullScreen open={outputDialogOpen}>
          <DialogTitle>React Image Annotate Output</DialogTitle>
          <DialogContent style={{ minWidth: 400 }}>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => changeOutputOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  )
}

export default Editor
