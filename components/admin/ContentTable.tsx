"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { createClient } from "@/lib/supabase/client";
import type { Frame } from "@/types";
import { Eye, EyeSlash, Trash, ArrowSquareOut, PencilSimple } from "@phosphor-icons/react";

interface SimpleCategory { id: string; name: string; slug: string; }
interface SimpleCreator  { id: string; display_name: string; username: string; }

interface ContentTableProps {
  frames: Frame[];
  categories: SimpleCategory[];
  creators: SimpleCreator[];
}

interface EditState {
  title: string;
  slug: string;
  description: string;
  category_id: string;
  creator_id: string;
  tags: string;
  technique_notes: string;
  rank: number;
}

function toEditState(frame: Frame): EditState {
  return {
    title: frame.title,
    slug: frame.slug,
    description: frame.description ?? "",
    category_id: frame.category_id ?? "",
    creator_id: frame.creator_id ?? "",
    tags: (frame.tags ?? []).join(", "),
    technique_notes: frame.technique_notes ?? "",
    rank: frame.rank,
  };
}

export default function ContentTable({ frames: initialFrames, categories, creators }: ContentTableProps) {
  const router = useRouter();
  const [frames, setFrames] = useState<Frame[]>(initialFrames);
  const [loading, setLoading] = useState<string | null>(null);
  const [editingFrame, setEditingFrame] = useState<Frame | null>(null);
  const [editState, setEditState] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  async function toggleHidden(frame: Frame) {
    setLoading(frame.id);
    const supabase = createClient();
    const { error } = await supabase
      .from("frames")
      .update({ is_hidden: !frame.is_hidden })
      .eq("id", frame.id);
    if (!error) {
      setFrames((prev) => prev.map((f) => f.id === frame.id ? { ...f, is_hidden: !f.is_hidden } : f));
    }
    setLoading(null);
  }

  async function deleteFrame(frame: Frame) {
    if (!confirm(`Delete "${frame.title}"? This cannot be undone.`)) return;
    setLoading(frame.id);
    const supabase = createClient();
    await supabase.from("frames").delete().eq("id", frame.id);
    setFrames((prev) => prev.filter((f) => f.id !== frame.id));
    setLoading(null);
    router.refresh();
  }

  function openEdit(frame: Frame) {
    setEditingFrame(frame);
    setEditState(toEditState(frame));
  }

  function closeEdit() {
    setEditingFrame(null);
    setEditState(null);
  }

  async function saveEdit() {
    if (!editingFrame || !editState) return;
    setSaving(true);
    const supabase = createClient();
    const tags = editState.tags.split(",").map((t) => t.trim()).filter(Boolean);

    const { error } = await supabase
      .from("frames")
      .update({
        title: editState.title,
        slug: editState.slug,
        description: editState.description || null,
        category_id: editState.category_id || null,
        creator_id: editState.creator_id || null,
        tags,
        technique_notes: editState.technique_notes || null,
        rank: editState.rank,
      })
      .eq("id", editingFrame.id);

    if (!error) {
      const updatedCategory = categories.find((c) => c.id === editState.category_id);
      const updatedCreator  = creators.find((c) => c.id === editState.creator_id);
      setFrames((prev) =>
        prev.map((f) =>
          f.id === editingFrame.id
            ? {
                ...f,
                ...editState,
                tags,
                description: editState.description || null,
                technique_notes: editState.technique_notes || null,
                category_id: editState.category_id || null,
                creator_id: editState.creator_id || null,
                category: updatedCategory ? { ...updatedCategory, description: null, created_at: "" } : undefined,
                creator: updatedCreator ? { ...updatedCreator, bio: null, avatar_url: null, website: null, instagram: null, created_at: "" } : undefined,
              }
            : f
        )
      );
      closeEdit();
      router.refresh();
    }
    setSaving(false);
  }

  if (frames.length === 0) {
    return (
      <Typography sx={{ fontSize: 14, color: "text.secondary", py: 6, textAlign: "center" }}>
        No frames yet.{" "}
        <Box component={Link} href="/admin/upload" sx={{ color: "text.primary", textDecoration: "underline" }}>
          Upload one
        </Box>
        .
      </Typography>
    );
  }

  const actionBtnSx = {
    p: 0.75,
    borderRadius: 1.5,
    color: "text.secondary",
    "&:hover": { bgcolor: "action.hover", color: "text.primary" },
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 60 }} />
              <TableCell>Title</TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>Category</TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Creator</TableCell>
              <TableCell align="right" sx={{ display: { xs: "none", lg: "table-cell" } }}>Rank</TableCell>
              <TableCell align="right" sx={{ display: { xs: "none", lg: "table-cell" } }}>Views</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {frames.map((frame) => (
              <TableRow key={frame.id} sx={{ opacity: frame.is_hidden ? 0.5 : 1 }}>

                {/* Thumbnail */}
                <TableCell>
                  <Box
                    sx={{
                      width: 48,
                      height: 40,
                      borderRadius: 1.5,
                      overflow: "hidden",
                      bgcolor: "action.selected",
                      flexShrink: 0,
                    }}
                  >
                    {(frame.thumbnail_url || frame.file_url) && (
                      <Image
                        src={frame.thumbnail_url || frame.file_url}
                        alt={frame.title}
                        width={48}
                        height={40}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        unoptimized
                      />
                    )}
                  </Box>
                </TableCell>

                {/* Title */}
                <TableCell>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "text.primary",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 200,
                    }}
                  >
                    {frame.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 11,
                      color: "text.disabled",
                      fontFamily: "monospace",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {frame.slug}
                  </Typography>
                </TableCell>

                {/* Category */}
                <TableCell sx={{ display: { xs: "none", sm: "table-cell" }, color: "text.secondary" }}>
                  {frame.category?.name || "—"}
                </TableCell>

                {/* Creator */}
                <TableCell sx={{ display: { xs: "none", md: "table-cell" }, color: "text.secondary" }}>
                  {frame.creator?.display_name || "—"}
                </TableCell>

                {/* Rank */}
                <TableCell align="right" sx={{ display: { xs: "none", lg: "table-cell" }, color: "text.secondary" }}>
                  {frame.rank}
                </TableCell>

                {/* Views */}
                <TableCell align="right" sx={{ display: { xs: "none", lg: "table-cell" }, color: "text.secondary" }}>
                  {frame.view_count?.toLocaleString()}
                </TableCell>

                {/* Status */}
                <TableCell align="center">
                  <Chip
                    label={frame.is_hidden ? "Hidden" : "Live"}
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: 11,
                      borderRadius: "9999px",
                      ...(frame.is_hidden
                        ? { bgcolor: "action.selected", color: "text.disabled" }
                        : { bgcolor: "rgba(16,185,129,0.12)", color: "rgb(16,185,129)" }
                      ),
                    }}
                  />
                </TableCell>

                {/* Actions */}
                <TableCell align="right">
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 0.25 }}>
                    <Tooltip title="Edit" arrow>
                      <IconButton
                        size="small"
                        onClick={() => openEdit(frame)}
                        sx={actionBtnSx}
                      >
                        <PencilSimple size={14} weight="regular" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="View" arrow>
                      <IconButton
                        size="small"
                        component={Link}
                        href={`/frame/${frame.slug}`}
                        target="_blank"
                        sx={actionBtnSx}
                      >
                        <ArrowSquareOut size={14} weight="regular" />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={frame.is_hidden ? "Show" : "Hide"} arrow>
                      <IconButton
                        size="small"
                        onClick={() => toggleHidden(frame)}
                        disabled={loading === frame.id}
                        sx={actionBtnSx}
                      >
                        {frame.is_hidden
                          ? <Eye size={14} weight="regular" />
                          : <EyeSlash size={14} weight="regular" />
                        }
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete" arrow>
                      <IconButton
                        size="small"
                        onClick={() => deleteFrame(frame)}
                        disabled={loading === frame.id}
                        sx={{
                          ...actionBtnSx,
                          "&:hover": { bgcolor: "rgba(239,68,68,0.1)", color: "#ef4444" },
                        }}
                      >
                        <Trash size={14} weight="regular" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit Dialog */}
      <Dialog
        open={Boolean(editingFrame)}
        onClose={closeEdit}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { maxHeight: "90vh" } }}
      >
        <DialogTitle>
          <Box>
            Edit Frame
            {editingFrame && (
              <Typography
                component="div"
                sx={{ fontSize: 11, color: "text.disabled", fontFamily: "monospace", mt: 0.25, fontWeight: 400 }}
              >
                {editingFrame.slug}
              </Typography>
            )}
          </Box>
        </DialogTitle>

        {editState && (
          <>
            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>

              {/* Title + Rank */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <TextField
                  label="Title"
                  value={editState.title}
                  onChange={(e) => setEditState({ ...editState, title: e.target.value })}
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Rank"
                  type="number"
                  value={editState.rank}
                  onChange={(e) => setEditState({ ...editState, rank: Number(e.target.value) })}
                  sx={{ width: 100 }}
                  size="small"
                />
              </Box>

              {/* Slug */}
              <TextField
                label="Slug"
                value={editState.slug}
                onChange={(e) => setEditState({ ...editState, slug: e.target.value })}
                fullWidth
                size="small"
                inputProps={{ style: { fontFamily: "monospace", fontSize: 12 } }}
              />

              {/* Description */}
              <TextField
                label="Description"
                value={editState.description}
                onChange={(e) => setEditState({ ...editState, description: e.target.value })}
                multiline
                rows={3}
                fullWidth
                size="small"
              />

              {/* Category + Creator */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={editState.category_id}
                    label="Category"
                    onChange={(e) => setEditState({ ...editState, category_id: e.target.value })}
                  >
                    <MenuItem value="">— None —</MenuItem>
                    {categories.map((c) => (
                      <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                  <InputLabel>Creator</InputLabel>
                  <Select
                    value={editState.creator_id}
                    label="Creator"
                    onChange={(e) => setEditState({ ...editState, creator_id: e.target.value })}
                  >
                    <MenuItem value="">— None —</MenuItem>
                    {creators.map((c) => (
                      <MenuItem key={c.id} value={c.id}>{c.display_name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Tags */}
              <TextField
                label="Tags (comma-separated)"
                value={editState.tags}
                onChange={(e) => setEditState({ ...editState, tags: e.target.value })}
                fullWidth
                size="small"
                placeholder="tag1, tag2, tag3"
              />

              {/* Technique Notes */}
              <TextField
                label="Technique Notes"
                value={editState.technique_notes}
                onChange={(e) => setEditState({ ...editState, technique_notes: e.target.value })}
                multiline
                rows={2}
                fullWidth
                size="small"
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={closeEdit} variant="outlined" size="small">
                Cancel
              </Button>
              <Button
                onClick={saveEdit}
                variant="contained"
                size="small"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}
